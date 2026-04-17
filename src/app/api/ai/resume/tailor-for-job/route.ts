import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import prisma from "@/lib/db";
import { incrementAIUsage } from "@/lib/ai-usage";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    const { validateFeatureAccess, FeatureType, createAccessDeniedResponse } = await import("@/lib/feature-access-control");
    const aiValidation = await validateFeatureAccess(FeatureType.AI_RESUME_REVIEW);

    if (!aiValidation.allowed) {
      return createAccessDeniedResponse(aiValidation);
    }

    const { baseResumeId, jobDescription } = await req.json();

    if (!baseResumeId || !jobDescription) {
      return NextResponse.json(
        { error: "Base resume and job description are required" },
        { status: 400 }
      );
    }

    const baseResume = await prisma.resume.findFirst({
      where: {
        id: baseResumeId,
        profile: {
          userId,
        },
      },
      include: {
        ContactInfo: true,
        Skills: true,
        ResumeSections: {
          include: {
            summary: true,
            workExperiences: {
              include: {
                Company: true,
                jobTitle: true,
                location: true,
              },
            },
            educations: {
              include: {
                location: true,
              },
            },
            licenseOrCertifications: true,
            others: true,
          },
        },
      },
    });

    if (!baseResume) {
      return NextResponse.json(
        { error: "Base resume not found" },
        { status: 404 }
      );
    }

    // Prepare context for AI
    const workExperiencesForAI = baseResume.ResumeSections?.flatMap((s) =>
      s.workExperiences?.map((w) => ({
        id: w.id,
        title: w.jobTitle?.label,
        company: w.Company?.label,
        description: w.description,
      }))
    ).filter(Boolean);

    const summarySection = baseResume.ResumeSections?.find(s => s.sectionType === "summary");
    const currentSummary = summarySection?.summary?.content || "";

    const userContent = JSON.stringify({
      currentSummary,
      workExperiences: workExperiencesForAI,
    }, null, 2);

    const prompt = `As an expert career coach, tailor the following resume content to match the Job Description.

JOB DESCRIPTION:
${jobDescription}

RESUME CONTENT:
${userContent}

INSTRUCTIONS:
1. Analyze the Job Description to identify key requirements and keywords.
2. Rewrite the "currentSummary" to align with these requirements.
3. Rewrite the "description" for each work experience entry to highlight relevant skills and achievements. NEVER invent facts. Only emphasize/rephrase existing info to match the job.
4. If a work experience description doesn't need changing, you can return the original or null.
5. Provide a global list of keywords found in the JD that are relevant to this candidate.
6. Suggest a tailored Title for the resume.

OUTPUT JSON FORMAT:
{
  "suggestedTitle": "string",
  "optimizedSummary": "string",
  "optimizedWorkExperiences": {
    "WORK_EXPERIENCE_ID_1": "rewritten description...",
    "WORK_EXPERIENCE_ID_2": "rewritten description..."
  },
  "keywordsToHighlight": ["string", "string"]
}`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a specialized JSON-only generator. You must output strictly valid JSON matching the requested format.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0]?.message?.content?.trim() || "{}";
    let optimization: any = {};

    try {
      optimization = JSON.parse(responseText);
    } catch (error) {
      console.error("Failed to parse AI optimization:", responseText);
      // Fallback: minimal optimization
      optimization = {
        suggestedTitle: `${baseResume.title} - Tailored`,
        optimizedSummary: currentSummary,
        optimizedWorkExperiences: {},
        keywordsToHighlight: [],
      };
    }

    const profile = await prisma.profile.findFirst({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // 1. Create the new Resume container
    let targetTitle = optimization.suggestedTitle || `${baseResume.title} - Job Tailored`;

    // Ensure uniqueness
    const maxRetries = 3;
    let attempt = 0;
    let titleToUniquify = targetTitle;

    while (attempt < maxRetries) {
      const existing = await prisma.resume.findFirst({
        where: {
          profileId: profile.id,
          title: titleToUniquify,
        },
        select: { id: true },
      });

      if (!existing) {
        break;
      }

      // Conflict found, append timestamp
      titleToUniquify = `${targetTitle} (${Date.now()})`;
      attempt++;
    }

    const newResume = await prisma.resume.create({
      data: {
        profileId: profile.id,
        title: titleToUniquify,
        template: baseResume.template,
        primaryColor: baseResume.primaryColor,
        aiGenerated: true,
        keywords: optimization.keywordsToHighlight || [],
      },
    });

    // 2. Clone Contact Info
    if (baseResume.ContactInfo) {
      await prisma.contactInfo.create({
        data: {
          resumeId: newResume.id,
          firstName: baseResume.ContactInfo.firstName,
          lastName: baseResume.ContactInfo.lastName,
          headline: baseResume.ContactInfo.headline, // Could optionally ask AI to tailor this too
          email: baseResume.ContactInfo.email,
          phone: baseResume.ContactInfo.phone,
          address: baseResume.ContactInfo.address,
        },
      });
    }

    // 3. Clone Skills
    if (baseResume.Skills && baseResume.Skills.length > 0) {
      await prisma.skill.createMany({
        data: baseResume.Skills.map((skill) => ({
          resumeId: newResume.id,
          name: skill.name,
          level: skill.level,
          category: skill.category,
        })),
      });
    }

    // 4. Iterate and deep clone sections
    if (baseResume.ResumeSections) {
      for (const oldSection of baseResume.ResumeSections) {
        // Create the new section shell
        const newSection = await prisma.resumeSection.create({
          data: {
            resumeId: newResume.id,
            sectionTitle: oldSection.sectionTitle,
            sectionType: oldSection.sectionType,
          },
        });

        // 4a. Handle Summary
        if (oldSection.sectionType === "summary" && oldSection.summary) {
          // Use AI-optimized summary if available, else original
          const contentToUse = optimization.optimizedSummary || oldSection.summary.content;

          const newSummary = await prisma.summary.create({
            data: {
              content: contentToUse,
            },
          });

          await prisma.resumeSection.update({
            where: { id: newSection.id },
            data: { summaryId: newSummary.id },
          });
        }

        // 4b. Handle Work Experiences
        if (oldSection.workExperiences && oldSection.workExperiences.length > 0) {
          for (const we of oldSection.workExperiences) {
            // Check if AI provided a rewrite for this specific ID
            const tailoredDesc = optimization.optimizedWorkExperiences?.[we.id];

            await prisma.workExperience.create({
              data: {
                resumeSectionId: newSection.id,
                companyId: we.companyId,
                jobTitleId: we.jobTitleId,
                locationId: we.locationId,
                startDate: we.startDate,
                endDate: we.endDate,
                description: tailoredDesc || we.description, // Use tailored or original
              }
            });
          }
        }

        // 4c. Handle Educations (Direct Clone)
        if (oldSection.educations && oldSection.educations.length > 0) {
          for (const edu of oldSection.educations) {
            await prisma.education.create({
              data: {
                resumeSectionId: newSection.id,
                institution: edu.institution,
                degree: edu.degree,
                fieldOfStudy: edu.fieldOfStudy,
                locationId: edu.locationId,
                startDate: edu.startDate,
                endDate: edu.endDate,
                description: edu.description
              }
            });
          }
        }

        // 4d. Handle Certifications (Direct Clone)
        if (oldSection.licenseOrCertifications && oldSection.licenseOrCertifications.length > 0) {
          for (const cert of oldSection.licenseOrCertifications) {
            await prisma.licenseOrCertification.create({
              data: {
                resumeSectionId: newSection.id,
                title: cert.title,
                organization: cert.organization,
                issueDate: cert.issueDate,
                expirationDate: cert.expirationDate,
                credentialUrl: cert.credentialUrl
              }
            });
          }
        }

        // 4e. Handle Other/Custom Sections (Direct Clone)
        if (oldSection.others && oldSection.others.length > 0) {
          for (const other of oldSection.others) {
            await prisma.otherSection.create({
              data: {
                resumeSectionId: newSection.id,
                title: other.title,
                content: other.content
              }
            });
          }
        }
      }
    }

    // Track usage
    await incrementAIUsage("tailor_resume", userId);

    return NextResponse.json(
      {
        resumeId: newResume.id,
        optimization,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to tailor resume";
    console.error("Error tailoring resume:", error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

