import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { chatCompletion, callWithRetry } from "@/lib/gemini";
import { EXTRACTION_SYSTEM_PROMPT, SKILL_INFERENCE_PROMPT } from "@/lib/prompts";
import { SKILL_TAXONOMY } from "@/lib/skill-taxonomy";
import { prisma } from "@/lib/db";
import pdfParse from "pdf-parse";

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

    // Parse PDF to text
    const bytes = await file.arrayBuffer();
    const pdfData = await pdfParse(Buffer.from(bytes));
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: "Could not extract text from PDF. The file may be image-based or empty." },
        { status: 400 }
      );
    }

    // Stage 1: Extract structured data from resume text
    const extractionSystemPrompt = EXTRACTION_SYSTEM_PROMPT + `

You MUST respond with valid JSON matching this exact structure:
{
  "name": "string",
  "email": "string",
  "title": "string",
  "location": "string",
  "skills": [{ "name": "string", "category": "LANGUAGE|FRAMEWORK|PLATFORM|TOOL|DOMAIN", "proficiency": "NOVICE|INTERMEDIATE|EXPERT", "yearsExp": number }],
  "projects": [{ "name": "string", "description": "string", "role": "string", "startDate": "YYYY-MM-DD", "endDate": "YYYY-MM-DD or empty", "techStack": ["string"] }],
  "certifications": [{ "name": "string", "issuer": "string", "date": "YYYY-MM-DD" }]
}`;

    const extractionResult = await callWithRetry(async () => {
      const result = await chatCompletion(
        extractionSystemPrompt,
        `Extract the complete professional profile from this resume. Be thorough and extract ALL information.\n\nRESUME TEXT:\n${resumeText}`,
        0.2
      );
      return JSON.parse(result);
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

    const inferenceSystemPrompt = `You are an expert at inferring related technical skills. Respond with valid JSON matching: { "inferredSkills": [{ "name": "string", "category": "LANGUAGE|FRAMEWORK|PLATFORM|TOOL|DOMAIN", "proficiency": "NOVICE|INTERMEDIATE|EXPERT", "yearsExp": number, "confidence": number, "reason": "string" }] }`;

    const inferenceResult = await callWithRetry(async () => {
      const result = await chatCompletion(
        inferenceSystemPrompt,
        inferencePrompt,
        0.3
      );
      return JSON.parse(result);
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
