import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { geminiPro, geminiFlash, callWithRetry } from "@/lib/gemini";
import { SEARCH_PARSE_PROMPT, SEARCH_RANKING_PROMPT } from "@/lib/prompts";
import { searchParseSchema, searchRankingSchema } from "@/lib/schemas";
import { prisma } from "@/lib/db";
import { searchSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "HR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = searchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { query } = parsed.data;

    // Stage A: Parse query into structured filters
    const filters = await callWithRetry(async () => {
      const result = await geminiFlash.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: `Parse this search query: "${query}"` }],
          },
        ],
        systemInstruction: SEARCH_PARSE_PROMPT,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: searchParseSchema as any,
          temperature: 0.2,
        },
      });
      return JSON.parse(result.response.text());
    });

    // Build DB query from parsed filters
    const where: any = {};

    if (filters.location) {
      where.location = {
        contains: filters.location,
        mode: "insensitive",
      };
    }

    if (filters.availability === "unallocated") {
      where.currentAllocation = null;
    }

    // Pull candidates with broad filters (limit 30)
    const candidates = await prisma.employee.findMany({
      where,
      include: {
        skills: { include: { skill: true } },
        projects: true,
        certifications: true,
      },
      take: 30,
    });

    if (candidates.length === 0) {
      // Fallback: get all employees if filters too restrictive
      const allCandidates = await prisma.employee.findMany({
        include: {
          skills: { include: { skill: true } },
          projects: true,
          certifications: true,
        },
        take: 30,
      });

      if (allCandidates.length === 0) {
        return NextResponse.json({ results: [], filters });
      }

      return await rankCandidates(query, allCandidates, filters);
    }

    return await rankCandidates(query, candidates, filters);
  } catch (error: any) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: error.message || "Search failed" },
      { status: 500 }
    );
  }
}

async function rankCandidates(query: string, candidates: any[], filters: any) {
  const candidateSummaries = candidates.map((c) => ({
    employeeId: c.id,
    name: c.name,
    title: c.title || "N/A",
    location: c.location || "N/A",
    currentAllocation: c.currentAllocation || "Unallocated",
    skills: c.skills.map(
      (es: any) =>
        `${es.skill.name} (${es.proficiency}, ${es.yearsExp}yrs${es.inferred ? ", inferred" : ""})`
    ),
    projects: c.projects.map(
      (p: any) =>
        `${p.name}: ${p.role} [${p.techStack.join(", ")}]`
    ),
    totalExperience: Math.max(
      ...c.skills.map((es: any) => es.yearsExp),
      0
    ),
  }));

  const prompt = SEARCH_RANKING_PROMPT.replace("{query}", query).replace(
    "{candidates}",
    JSON.stringify(candidateSummaries, null, 2)
  );

  // Stage B: Rank candidates with Gemini Pro
  const ranking = await callWithRetry(async () => {
    const result = await geminiPro.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: searchRankingSchema as any,
        temperature: 0.4,
      },
    });
    return JSON.parse(result.response.text());
  });

  // Hydrate rankings with full employee data
  const rankingMap = new Map(
    (ranking.rankings || []).map((r: any) => [r.employeeId, r])
  );

  const results = candidates
    .map((c) => {
      const rank = rankingMap.get(c.id) as any;
      return {
        employee: {
          id: c.id,
          name: c.name,
          email: c.email,
          title: c.title,
          location: c.location,
          currentAllocation: c.currentAllocation,
          lastProjectEndDate: c.lastProjectEndDate,
        },
        skills: c.skills.map((es: any) => ({
          name: es.skill.name,
          category: es.skill.category,
          proficiency: es.proficiency,
          yearsExp: es.yearsExp,
          inferred: es.inferred,
          confidence: es.confidence,
        })),
        projects: c.projects,
        score: rank?.score || 0,
        reasoning: rank?.reasoning || "No ranking available",
      };
    })
    .sort((a, b) => b.score - a.score);

  return NextResponse.json({ results, filters });
}
