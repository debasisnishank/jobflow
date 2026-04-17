import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import type { PrismaClient } from "@prisma/client";
import { parseResumeFromPdf } from "@/lib/resume-parser";
import { incrementAIUsage } from "@/lib/ai-usage";

type PrismaClientLike = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

function asCleanString(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/\u0000/g, "").trim();
}

function coerceYearMonthToDate(input: unknown): Date | null {
  const s = asCleanString(input);
  if (!s) return null;
  if (/^(present|current|now)$/i.test(s)) return null;

  const m1 = s.match(/^(\d{4})-(\d{2})$/);
  if (m1) {
    const year = Number(m1[1]);
    const month = Number(m1[2]);
    if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) return null;
    return new Date(Date.UTC(year, month - 1, 1));
  }

  const m2 = s.match(/^(\d{4})$/);
  if (m2) {
    const year = Number(m2[1]);
    if (!Number.isFinite(year)) return null;
    return new Date(Date.UTC(year, 0, 1));
  }

  return null;
}

// --- DB Helper Functions (Outside Transaction Scope) ---

async function findOrCreateJobTitle(userId: string, title: string, db: PrismaClientLike): Promise<string> {
  const value = title.toLowerCase().trim();
  const existing = await db.jobTitle.findFirst({
    where: { value, createdBy: userId },
    select: { id: true },
  });
  if (existing) return existing.id;

  const created = await db.jobTitle.create({
    data: { label: title, value, createdBy: userId },
    select: { id: true },
  });
  return created.id;
}

async function findOrCreateCompany(userId: string, company: string, db: PrismaClientLike): Promise<string> {
  const value = company.toLowerCase().trim();
  const existing = await db.company.findFirst({
    where: { value, createdBy: userId },
    select: { id: true },
  });
  if (existing) return existing.id;

  const created = await db.company.create({
    data: { label: company, value, createdBy: userId },
    select: { id: true },
  });
  return created.id;
}

async function findOrCreateLocation(userId: string, location: string, db: PrismaClientLike): Promise<string> {
  const value = location.toLowerCase().trim();
  const existing = await db.location.findFirst({
    where: { value, createdBy: userId },
    select: { id: true },
  });
  if (existing) return existing.id;

  const created = await db.location.create({
    data: { label: location, value, createdBy: userId },
    select: { id: true },
  });
  return created.id;
}

async function makeUniqueResumeTitle(profileId: string, baseTitle: string, db: PrismaClientLike): Promise<string> {
  const safeBase = baseTitle.trim() || "Imported Resume";
  const existing = await db.resume.findFirst({
    where: { profileId, title: safeBase },
    select: { id: true },
  });
  if (!existing) return safeBase;

  for (let i = 2; i <= 50; i++) {
    const candidate = `${safeBase} (${i})`;
    const hit = await db.resume.findFirst({
      where: { profileId, title: candidate },
      select: { id: true },
    });
    if (!hit) return candidate;
  }

  return `${safeBase} (${Date.now()})`;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.accessToken) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const userId = session.accessToken.sub;

    const { validateResumeCreation } = await import("@/lib/plan-validation");
    const resumeValidation = await validateResumeCreation();

    if (!resumeValidation.allowed) {
      return NextResponse.json(
        {
          error: resumeValidation.message || "Resume creation limit reached",
          code: "RESUME_LIMIT_REACHED"
        },
        { status: 403 }
      );
    }

    const { validateStorageUpload } = await import("@/lib/plan-validation");
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const storageValidation = await validateStorageUpload(buffer.length);
    if (!storageValidation.allowed) {
      return NextResponse.json(
        {
          error: storageValidation.message || "Storage limit exceeded",
          code: "STORAGE_LIMIT_REACHED"
        },
        { status: 403 }
      );
    }

    // --- Parsing Logic via Shared Library ---
    let parsedData;
    try {
      if (file.type !== "application/pdf" && !file.name?.toLowerCase().endsWith(".pdf")) {
        return NextResponse.json(
          { error: "Please upload a PDF file for best results" },
          { status: 400 }
        );
      }

      parsedData = await parseResumeFromPdf(buffer);
    } catch (error: any) {
      console.error("Error extracting text/images:", error);
      return NextResponse.json(
        { error: `Failed to parse resume: ${error.message || 'Unknown error'}` },
        { status: 500 }
      );
    }

    // --- Optimization: Pre-resolve/Create Relations OUTSIDE Transaction ---
    const contactInfo = parsedData?.contactInfo ?? {};
    const summary = asCleanString(parsedData?.summary);
    const skills = Array.isArray(parsedData?.skills) ? parsedData.skills : [];
    const workExperiences = Array.isArray(parsedData?.workExperiences) ? parsedData.workExperiences : [];
    const educations = Array.isArray(parsedData?.educations) ? parsedData.educations : [];
    const certifications = Array.isArray(parsedData?.certifications) ? parsedData.certifications : [];

    // Helper to store resolved IDs to avoid re-querying in loop
    interface WorkExperiencePayload {
      companyId: string;
      jobTitleId: string;
      locationId: string;
      startDate: Date;
      endDate: Date | null;
      description: string;
    }

    const workExperiencePayloads: WorkExperiencePayload[] = [];
    for (const exp of workExperiences) {
      const company = asCleanString(exp?.company);
      const jobTitle = asCleanString(exp?.jobTitle);
      const location = asCleanString(exp?.location) || "Remote";
      let startDate = coerceYearMonthToDate(exp?.startDate);

      // Skip if missing critical info
      if (!company || !jobTitle) {
        console.warn(`Skipping work experience: missing company or jobTitle`);
        continue;
      }

      // Fallback for invalid dates - use current year
      if (!startDate) {
        const currentYear = new Date().getFullYear();
        startDate = new Date(Date.UTC(currentYear - 1, 0, 1)); // Default to last year
        console.warn(`Invalid startDate for ${company} - ${jobTitle}, using fallback: ${currentYear - 1}-01`);
      }

      // These calls are now outside transaction, significantly reducing lock time
      const companyId = await findOrCreateCompany(userId, company, prisma);
      const jobTitleId = await findOrCreateJobTitle(userId, jobTitle, prisma);
      const locationId = await findOrCreateLocation(userId, location, prisma);

      workExperiencePayloads.push({
        companyId,
        jobTitleId,
        locationId,
        startDate,
        endDate: exp?.current ? null : coerceYearMonthToDate(exp?.endDate),
        description: asCleanString(exp?.description),
      });
    }

    interface EducationPayload {
      institution: string;
      degree: string;
      fieldOfStudy: string;
      locationId: string;
      startDate: Date;
      endDate: Date | null;
      description: string | null;
    }

    const educationPayloads: EducationPayload[] = [];
    for (const edu of educations) {
      const institution = asCleanString(edu?.institution);
      const degree = asCleanString(edu?.degree);
      const location = asCleanString(edu?.location) || "Unknown";
      const startDate = coerceYearMonthToDate(edu?.startDate);

      if (!institution || !degree || !startDate) continue;

      const locationId = await findOrCreateLocation(userId, location, prisma);

      educationPayloads.push({
        institution,
        degree,
        fieldOfStudy: asCleanString(edu?.fieldOfStudy),
        locationId,
        startDate,
        endDate: coerceYearMonthToDate(edu?.endDate),
        description: asCleanString(edu?.description) || null,
      });
    }

    // --- Begin Transaction (Reduced Scope) ---
    const resumeId = await prisma.$transaction(async (tx) => {
      let profile = await tx.profile.findFirst({
        where: { userId },
        select: { id: true },
      });

      if (!profile) {
        profile = await tx.profile.create({
          data: { userId },
          select: { id: true },
        });
      }

      const firstName = asCleanString(contactInfo.firstName);
      const lastName = asCleanString(contactInfo.lastName);
      const fullName = `${firstName} ${lastName}`.trim();
      const baseTitle = fullName ? `${fullName} Resume` : "Imported Resume";
      const title = await makeUniqueResumeTitle(profile.id, baseTitle, tx);

      const resume = await tx.resume.create({
        data: {
          profileId: profile.id,
          title,
          template: "modern",
          primaryColor: "#3B82F6",
          aiGenerated: true,
        },
        select: { id: true },
      });

      await tx.contactInfo.create({
        data: {
          resumeId: resume.id,
          firstName,
          lastName,
          headline: asCleanString(contactInfo.headline),
          email: asCleanString(contactInfo.email),
          phone: asCleanString(contactInfo.phone),
          address: asCleanString(contactInfo.address) || null,
        },
      });

      if (summary) {
        const newSummary = await tx.summary.create({
          data: { content: summary },
          select: { id: true },
        });
        await tx.resumeSection.create({
          data: {
            resumeId: resume.id,
            sectionTitle: "Professional Summary",
            sectionType: "summary",
            summaryId: newSummary.id,
          },
        });
      }

      if (skills.length > 0) {
        await tx.skill.createMany({
          data: skills
            .map((skill: any) => ({
              resumeId: resume.id,
              name: asCleanString(skill?.name),
              level: asCleanString(skill?.level) || null,
              category: asCleanString(skill?.category) || null,
            }))
            .filter((s: any) => !!s.name),
        });
      }

      if (workExperiencePayloads.length > 0) {
        const expSection = await tx.resumeSection.create({
          data: {
            resumeId: resume.id,
            sectionTitle: "Work Experience",
            sectionType: "experience",
          },
          select: { id: true },
        });

        for (const exp of workExperiencePayloads) {
          await tx.workExperience.create({
            data: {
              ...exp,
              resumeSectionId: expSection.id,
            }
          });
        }
      }

      if (educationPayloads.length > 0) {
        const eduSection = await tx.resumeSection.create({
          data: {
            resumeId: resume.id,
            sectionTitle: "Education",
            sectionType: "education",
          },
          select: { id: true },
        });

        for (const edu of educationPayloads) {
          await tx.education.create({
            data: {
              ...edu,
              resumeSectionId: eduSection.id,
            }
          });
        }
      }

      if (certifications.length > 0) {
        const certSection = await tx.resumeSection.create({
          data: {
            resumeId: resume.id,
            sectionTitle: "Certifications",
            sectionType: "certification",
          },
          select: { id: true },
        });

        for (const cert of certifications) {
          const title = asCleanString(cert?.title);
          const organization = asCleanString(cert?.organization);
          if (!title || !organization) continue;

          const issueDate = coerceYearMonthToDate(cert?.issueDate);
          const expirationDate = coerceYearMonthToDate(cert?.expirationDate);
          const credentialUrl = asCleanString(cert?.credentialUrl) || null;

          await tx.licenseOrCertification.create({
            data: {
              title,
              organization,
              issueDate,
              expirationDate,
              credentialUrl,
              resumeSectionId: certSection.id,
            },
          });
        }
      }

      return resume.id;
    }, {
      maxWait: 5000,
      timeout: 10000,
    });

    // Track usage
    await incrementAIUsage("resume_parse", userId);

    return NextResponse.json({ resumeId }, { status: 200 });
  } catch (error: any) {
    console.error("Error parsing resume:", error);
    return NextResponse.json(
      { error: error.message || "Failed to parse resume" },
      { status: 500 }
    );
  }
}
