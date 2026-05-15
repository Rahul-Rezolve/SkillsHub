import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { reviewSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "HR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "PENDING";

    const drafts = await prisma.profileDraft.findMany({
      where: { status: status as any },
      include: { employee: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(drafts);
  } catch (error) {
    console.error("Review GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "HR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { draftId, action, editedJson } = parsed.data;

    const draft = await prisma.profileDraft.findUnique({
      where: { id: draftId },
    });

    if (!draft) {
      return NextResponse.json(
        { error: "Draft not found" },
        { status: 404 }
      );
    }

    if (action === "REJECTED") {
      await prisma.profileDraft.update({
        where: { id: draftId },
        data: { status: "REJECTED" },
      });
      return NextResponse.json({ status: "REJECTED" });
    }

    // APPROVED: commit profile to Employee tables
    const profileData = (editedJson || draft.extractedJson) as any;

    // Find or create employee
    let employee = draft.employeeId
      ? await prisma.employee.findUnique({ where: { id: draft.employeeId } })
      : await prisma.employee.findUnique({
          where: { email: profileData.email },
        });

    if (!employee) {
      employee = await prisma.employee.create({
        data: {
          name: profileData.name,
          email: profileData.email,
          title: profileData.title || null,
          location: profileData.location || null,
        },
      });
    } else {
      employee = await prisma.employee.update({
        where: { id: employee.id },
        data: {
          name: profileData.name,
          title: profileData.title || employee.title,
          location: profileData.location || employee.location,
        },
      });
    }

    // Clear existing skills/projects/certs and re-create
    await prisma.employeeSkill.deleteMany({
      where: { employeeId: employee.id },
    });
    await prisma.project.deleteMany({
      where: { employeeId: employee.id },
    });
    await prisma.certification.deleteMany({
      where: { employeeId: employee.id },
    });

    // Create skills
    for (const skill of profileData.skills || []) {
      let dbSkill = await prisma.skill.findUnique({
        where: { name: skill.name },
      });
      if (!dbSkill) {
        dbSkill = await prisma.skill.create({
          data: { name: skill.name, category: skill.category },
        });
      }
      await prisma.employeeSkill.create({
        data: {
          employeeId: employee.id,
          skillId: dbSkill.id,
          proficiency: skill.proficiency,
          yearsExp: skill.yearsExp || 0,
          inferred: skill.inferred || false,
          confidence: skill.confidence || 1.0,
        },
      });
    }

    // Create projects
    for (const project of profileData.projects || []) {
      await prisma.project.create({
        data: {
          employeeId: employee.id,
          name: project.name,
          description: project.description || null,
          role: project.role || null,
          startDate: new Date(project.startDate),
          endDate: project.endDate ? new Date(project.endDate) : null,
          techStack: project.techStack || [],
        },
      });
    }

    // Create certifications
    for (const cert of profileData.certifications || []) {
      await prisma.certification.create({
        data: {
          employeeId: employee.id,
          name: cert.name,
          issuer: cert.issuer || null,
          date: cert.date ? new Date(cert.date) : null,
        },
      });
    }

    // Update draft
    await prisma.profileDraft.update({
      where: { id: draftId },
      data: {
        status: "APPROVED",
        employeeId: employee.id,
        extractedJson: profileData,
      },
    });

    return NextResponse.json({
      status: "APPROVED",
      employeeId: employee.id,
    });
  } catch (error: any) {
    console.error("Review POST error:", error);
    return NextResponse.json(
      { error: error.message || "Review action failed" },
      { status: 500 }
    );
  }
}
