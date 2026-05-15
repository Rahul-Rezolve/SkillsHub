import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { geminiPro, geminiFlash, callWithRetry } from "@/lib/gemini";
import { EXTRACTION_SYSTEM_PROMPT, SKILL_INFERENCE_PROMPT } from "@/lib/prompts";
import {
  extractionResponseSchema,
  inferredSkillsSchema,
} from "@/lib/schemas";
import { SKILL_TAXONOMY } from "@/lib/skill-taxonomy";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("resume") as File | null;

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Please upload a PDF file" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    // Stage 1: Extract structured data from PDF
    const extractionResult = await callWithRetry(async () => {
      const result = await geminiPro.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  mimeType: "application/pdf",
                  data: base64,
                },
              },
              {
                text: "Extract the complete professional profile from this resume. Be thorough and extract ALL information.",
              },
            ],
          },
        ],
        systemInstruction: EXTRACTION_SYSTEM_PROMPT,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: extractionResponseSchema as any,
          temperature: 0.2,
        },
      });
      return JSON.parse(result.response.text());
    });

    // Stage 2: Infer related skills
    const explicitSkillNames = extractionResult.skills.map(
      (s: any) => s.name
    );
    const taxonomyList = SKILL_TAXONOMY.map(
      (s) => `${s.name} (${s.category})`
    ).join(", ");
    const skillsList = extractionResult.skills
      .map(
        (s: any) =>
          `${s.name} (${s.category}, ${s.proficiency}, ${s.yearsExp}yrs)`
      )
      .join(", ");

    const inferencePrompt = SKILL_INFERENCE_PROMPT.replace(
      "{taxonomy}",
      taxonomyList
    ).replace("{skills}", skillsList);

    const inferenceResult = await callWithRetry(async () => {
      const result = await geminiFlash.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: inferencePrompt }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: inferredSkillsSchema as any,
          temperature: 0.3,
        },
      });
      return JSON.parse(result.response.text());
    });

    // Merge inferred skills (exclude duplicates)
    const inferredSkills = (inferenceResult.inferredSkills || [])
      .filter(
        (s: any) =>
          !explicitSkillNames
            .map((n: string) => n.toLowerCase())
            .includes(s.name.toLowerCase())
      )
      .map((s: any) => ({
        ...s,
        inferred: true,
      }));

    const allSkills = [
      ...extractionResult.skills.map((s: any) => ({
        ...s,
        inferred: false,
        confidence: 1.0,
      })),
      ...inferredSkills,
    ];

    const fullProfile = {
      ...extractionResult,
      skills: allSkills,
    };

    // Save as ProfileDraft
    const draft = await prisma.profileDraft.create({
      data: {
        employeeEmail: extractionResult.email,
        extractedJson: fullProfile,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      draftId: draft.id,
      profile: fullProfile,
      status: "PENDING",
    });
  } catch (error: any) {
    console.error("Extract error:", error);
    return NextResponse.json(
      { error: error.message || "Extraction failed" },
      { status: 500 }
    );
  }
}
