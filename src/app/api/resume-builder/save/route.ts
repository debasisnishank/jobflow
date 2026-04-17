import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import type { PrismaClient } from "@prisma/client";

// Type that works with both PrismaClient and transaction client
type PrismaClientLike = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

async function findOrCreateJobTitle(userId: string, title: string, db: PrismaClientLike) {
  const existing = await db.jobTitle.findFirst({
    where: {
      value: title.toLowerCase().trim(),
      createdBy: userId,
    },
  });

  if (existing) {
    return existing.id;
  }

  const newJobTitle = await db.jobTitle.create({
    data: {
      label: title,
      value: title.toLowerCase().trim(),
      createdBy: userId,
    },
  });

  return newJobTitle.id;
}

async function findOrCreateCompany(userId: string, company: string, db: PrismaClientLike) {
  const existing = await db.company.findFirst({
    where: {
      value: company.toLowerCase().trim(),
      createdBy: userId,
    },
  });

  if (existing) {
    return existing.id;
  }

  const newCompany = await db.company.create({
    data: {
      label: company,
      value: company.toLowerCase().trim(),
      createdBy: userId,
    },
  });

  return newCompany.id;
}

async function findOrCreateLocation(userId: string, location: string, db: PrismaClientLike) {
  const existing = await db.location.findFirst({
    where: {
      value: location.toLowerCase().trim(),
      createdBy: userId,
    },
  });

  if (existing) {
    return existing.id;
  }

  const newLocation = await db.location.create({
    data: {
      label: location,
      value: location.toLowerCase().trim(),
      createdBy: userId,
    },
  });

  return newLocation.id;
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
    const data = await req.json();

    const {
      id,
      title,
      template,
      primaryColor,
      contactInfo,
      summary,
      workExperiences,
      educations,
      skills,
      certifications,
      customSections,
    } = data;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "Resume title is required" },
        { status: 400 }
      );
    }

    let profile = await prisma.profile.findFirst({
      where: { userId },
    });

    if (!profile) {
      profile = await prisma.profile.create({
        data: { userId },
      });
    }

    if (id) {
      const existingResume = await prisma.resume.findFirst({
        where: {
          id,
          profileId: profile.id,
        },
      });

      if (!existingResume) {
        return NextResponse.json(
          { error: "Resume not found or access denied" },
          { status: 404 }
        );
      }

      await prisma.$transaction(async (tx) => {
        await tx.resume.update({
          where: { id },
          data: {
            title: title.trim(),
            template: template || "modern",
            primaryColor: primaryColor || "#3B82F6",
          },
        });

        if (contactInfo) {
          await tx.contactInfo.upsert({
            where: { resumeId: id },
            update: {
              firstName: contactInfo.firstName || "",
              lastName: contactInfo.lastName || "",
              headline: contactInfo.headline || "",
              email: contactInfo.email || "",
              phone: contactInfo.phone || "",
              address: contactInfo.address || null,
            },
            create: {
              resumeId: id,
              firstName: contactInfo.firstName || "",
              lastName: contactInfo.lastName || "",
              headline: contactInfo.headline || "",
              email: contactInfo.email || "",
              phone: contactInfo.phone || "",
              address: contactInfo.address || null,
            },
          });
        }

        if (summary && summary.trim()) {
          const summarySection = await tx.resumeSection.findFirst({
            where: {
              resumeId: id,
              sectionType: "summary",
            },
          });

          if (summarySection?.summaryId) {
            await tx.summary.update({
              where: { id: summarySection.summaryId },
              data: { content: summary },
            });
          } else if (summarySection) {
            const newSummary = await tx.summary.create({
              data: { content: summary },
            });
            await tx.resumeSection.update({
              where: { id: summarySection.id },
              data: { summaryId: newSummary.id },
            });
          } else {
            const newSummary = await tx.summary.create({
              data: { content: summary },
            });
            await tx.resumeSection.create({
              data: {
                resumeId: id,
                sectionTitle: "Professional Summary",
                sectionType: "summary",
                summaryId: newSummary.id,
              },
            });
          }
        }

        await tx.skill.deleteMany({
          where: { resumeId: id },
        });

        if (skills && Array.isArray(skills)) {
          const validSkills = skills.filter((s: any) => s && typeof s === 'object');
          if (validSkills.length > 0) {
            await tx.skill.createMany({
              data: validSkills.map((skill: any) => ({
                resumeId: id,
                name: skill.name || "",
                level: skill.level || null,
                category: skill.category || null,
              })),
            });
          }
        }

        const experienceSection = await tx.resumeSection.findFirst({
          where: {
            resumeId: id,
            sectionType: "experience",
          },
        });

        if (workExperiences && workExperiences.length > 0) {
          await tx.workExperience.deleteMany({
            where: {
              resumeSectionId: experienceSection?.id,
            },
          });

          let expSection = experienceSection;
          if (!expSection) {
            expSection = await tx.resumeSection.create({
              data: {
                resumeId: id,
                sectionTitle: "Work Experience",
                sectionType: "experience",
              },
            });
          }

          for (const exp of workExperiences) {
            if (!exp.jobTitle || !exp.company) continue;

            const jobTitleId = await findOrCreateJobTitle(userId, exp.jobTitle, tx);
            const companyId = await findOrCreateCompany(userId, exp.company, tx);
            const locationId = exp.location
              ? await findOrCreateLocation(userId, exp.location, tx)
              : await findOrCreateLocation(userId, "Remote", tx);

            await tx.workExperience.create({
              data: {
                companyId,
                jobTitleId,
                locationId,
                startDate: exp.startDate ? (() => { const d = exp.startDate.length === 10 ? new Date(exp.startDate) : new Date(exp.startDate + "-01"); return !isNaN(d.getTime()) ? d : new Date(); })() : new Date(),
                endDate: exp.endDate ? (() => { const d = exp.endDate.length === 10 ? new Date(exp.endDate) : new Date(exp.endDate + "-01"); return !isNaN(d.getTime()) ? d : null; })() : null,
                description: exp.description || "",
                resumeSectionId: expSection.id,
              },
            });
          }
        } else if (experienceSection) {
          await tx.workExperience.deleteMany({
            where: {
              resumeSectionId: experienceSection.id,
            },
          });
        }

        const educationSection = await tx.resumeSection.findFirst({
          where: {
            resumeId: id,
            sectionType: "education",
          },
        });

        if (educations && educations.length > 0) {
          await tx.education.deleteMany({
            where: {
              resumeSectionId: educationSection?.id,
            },
          });

          let eduSection = educationSection;
          if (!eduSection) {
            eduSection = await tx.resumeSection.create({
              data: {
                resumeId: id,
                sectionTitle: "Education",
                sectionType: "education",
              },
            });
          }

          for (const edu of educations) {
            if (!edu.institution || !edu.degree) continue;

            const locationId = edu.location
              ? await findOrCreateLocation(userId, edu.location, tx)
              : await findOrCreateLocation(userId, "Unknown", tx);

            await tx.education.create({
              data: {
                institution: edu.institution,
                degree: edu.degree,
                fieldOfStudy: edu.fieldOfStudy || "",
                locationId,
                startDate: edu.startDate ? (() => { const d = edu.startDate.length === 10 ? new Date(edu.startDate) : new Date(edu.startDate + "-01"); return !isNaN(d.getTime()) ? d : new Date(); })() : new Date(),
                endDate: edu.endDate ? (() => { const d = edu.endDate.length === 10 ? new Date(edu.endDate) : new Date(edu.endDate + "-01"); return !isNaN(d.getTime()) ? d : null; })() : null,
                description: edu.description || null,
                resumeSectionId: eduSection.id,
              },
            });
          }
        } else if (educationSection) {
          await tx.education.deleteMany({
            where: {
              resumeSectionId: educationSection.id,
            },
          });
        }

        const certificationSection = await tx.resumeSection.findFirst({
          where: {
            resumeId: id,
            sectionType: "certification",
          },
        });

        if (certifications && certifications.length > 0) {
          await tx.licenseOrCertification.deleteMany({
            where: {
              resumeSectionId: certificationSection?.id,
            },
          });

          let certSection = certificationSection;
          if (!certSection) {
            certSection = await tx.resumeSection.create({
              data: {
                resumeId: id,
                sectionTitle: "Certifications",
                sectionType: "certification",
              },
            });
          }

          for (const cert of certifications) {
            if (!cert.title || !cert.organization) continue;

            await tx.licenseOrCertification.create({
              data: {
                title: cert.title,
                organization: cert.organization,
                issueDate: cert.issueDate ? (() => { const d = cert.issueDate.length === 10 ? new Date(cert.issueDate) : new Date(cert.issueDate + "-01"); return !isNaN(d.getTime()) ? d : null; })() : null,
                expirationDate: cert.expirationDate
                  ? (() => { const d = cert.expirationDate.length === 10 ? new Date(cert.expirationDate) : new Date(cert.expirationDate + "-01"); return !isNaN(d.getTime()) ? d : null; })()
                  : null,
                credentialUrl: cert.credentialUrl || null,
                resumeSectionId: certSection.id,
              },
            });
          }
        } else if (certificationSection) {
          await tx.licenseOrCertification.deleteMany({
            where: {
              resumeSectionId: certificationSection.id,
            },
          });
        }

        const customSectionsData = await tx.resumeSection.findMany({
          where: {
            resumeId: id,
            sectionType: "other",
          },
          include: {
            others: true,
          },
        });

        for (const customSection of customSectionsData) {
          await tx.otherSection.deleteMany({
            where: {
              resumeSectionId: customSection.id,
            },
          });
        }

        await tx.resumeSection.deleteMany({
          where: {
            resumeId: id,
            sectionType: "other",
          },
        });

        if (customSections && customSections.length > 0) {
          for (const custom of customSections) {
            if (!custom.title || !custom.content) continue;

            const customSection = await tx.resumeSection.create({
              data: {
                resumeId: id,
                sectionTitle: custom.title,
                sectionType: "other",
              },
            });

            await tx.otherSection.create({
              data: {
                title: custom.title,
                content: custom.content,
                resumeSectionId: customSection.id,
              },
            });
          }
        }
      }, {
        timeout: 20000,
      });

      return NextResponse.json({ success: true, resumeId: id }, { status: 200 });
    } else {
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

      const trimmedTitle = title.trim();

      const existingResumes = await prisma.resume.findMany({
        where: {
          profileId: profile.id,
        },
        select: { title: true },
      });

      const titleExists = existingResumes.some(
        (resume) => resume.title.toLowerCase() === trimmedTitle.toLowerCase()
      );

      if (titleExists) {
        return NextResponse.json(
          { error: "A resume with this title already exists" },
          { status: 400 }
        );
      }

      const newResume = await prisma.resume.create({
        data: {
          profileId: profile.id,
          title: trimmedTitle,
          template: template || "modern",
          primaryColor: primaryColor || "#3B82F6",
        },
      });

      if (contactInfo) {
        await prisma.contactInfo.create({
          data: {
            resumeId: newResume.id,
            firstName: contactInfo.firstName || "",
            lastName: contactInfo.lastName || "",
            headline: contactInfo.headline || "",
            email: contactInfo.email || "",
            phone: contactInfo.phone || "",
            address: contactInfo.address || null,
          },
        });
      }

      if (summary && summary.trim()) {
        const newSummary = await prisma.summary.create({
          data: { content: summary },
        });
        await prisma.resumeSection.create({
          data: {
            resumeId: newResume.id,
            sectionTitle: "Professional Summary",
            sectionType: "summary",
            summaryId: newSummary.id,
          },
        });
      }

      if (skills && Array.isArray(skills)) {
        const validSkills = skills.filter((s: any) => s && typeof s === 'object');
        if (validSkills.length > 0) {
          await prisma.skill.createMany({
            data: validSkills.map((skill: any) => ({
              resumeId: newResume.id,
              name: skill.name || "",
              level: skill.level || null,
              category: skill.category || null,
            })),
          });
        }
      }

      if (workExperiences && workExperiences.length > 0) {
        const expSection = await prisma.resumeSection.create({
          data: {
            resumeId: newResume.id,
            sectionTitle: "Work Experience",
            sectionType: "experience",
          },
        });

        for (const exp of workExperiences) {
          if (!exp.jobTitle || !exp.company) continue;

          const jobTitleId = await findOrCreateJobTitle(userId, exp.jobTitle, prisma);
          const companyId = await findOrCreateCompany(userId, exp.company, prisma);
          const locationId = exp.location
            ? await findOrCreateLocation(userId, exp.location, prisma)
            : await findOrCreateLocation(userId, "Remote", prisma);

          await prisma.workExperience.create({
            data: {
              companyId,
              jobTitleId,
              locationId,
              startDate: exp.startDate ? (() => { const d = exp.startDate.length === 10 ? new Date(exp.startDate) : new Date(exp.startDate + "-01"); return !isNaN(d.getTime()) ? d : new Date(); })() : new Date(),
              endDate: exp.endDate ? (() => { const d = exp.endDate.length === 10 ? new Date(exp.endDate) : new Date(exp.endDate + "-01"); return !isNaN(d.getTime()) ? d : null; })() : null,
              description: exp.description || "",
              resumeSectionId: expSection.id,
            },
          });
        }
      }

      if (educations && educations.length > 0) {
        const eduSection = await prisma.resumeSection.create({
          data: {
            resumeId: newResume.id,
            sectionTitle: "Education",
            sectionType: "education",
          },
        });

        for (const edu of educations) {
          if (!edu.institution || !edu.degree) continue;

          const locationId = edu.location
            ? await findOrCreateLocation(userId, edu.location, prisma)
            : await findOrCreateLocation(userId, "Unknown", prisma);

          await prisma.education.create({
            data: {
              institution: edu.institution,
              degree: edu.degree,
              fieldOfStudy: edu.fieldOfStudy || "",
              locationId,
              startDate: edu.startDate ? (() => { const d = edu.startDate.length === 10 ? new Date(edu.startDate) : new Date(edu.startDate + "-01"); return !isNaN(d.getTime()) ? d : new Date(); })() : new Date(),
              endDate: edu.endDate ? (() => { const d = edu.endDate.length === 10 ? new Date(edu.endDate) : new Date(edu.endDate + "-01"); return !isNaN(d.getTime()) ? d : null; })() : null,
              description: edu.description || null,
              resumeSectionId: eduSection.id,
            },
          });
        }
      }

      if (certifications && certifications.length > 0) {
        const certSection = await prisma.resumeSection.create({
          data: {
            resumeId: newResume.id,
            sectionTitle: "Certifications",
            sectionType: "certification",
          },
        });

        for (const cert of certifications) {
          if (!cert.title || !cert.organization) continue;

          await prisma.licenseOrCertification.create({
            data: {
              title: cert.title,
              organization: cert.organization,
              issueDate: cert.issueDate ? (() => { const d = cert.issueDate.length === 10 ? new Date(cert.issueDate) : new Date(cert.issueDate + "-01"); return !isNaN(d.getTime()) ? d : null; })() : null,
              expirationDate: cert.expirationDate
                ? (() => { const d = cert.expirationDate.length === 10 ? new Date(cert.expirationDate) : new Date(cert.expirationDate + "-01"); return !isNaN(d.getTime()) ? d : null; })()
                : null,
              credentialUrl: cert.credentialUrl || null,
              resumeSectionId: certSection.id,
            },
          });
        }
      }

      if (customSections && customSections.length > 0) {
        for (const custom of customSections) {
          if (!custom.title || !custom.content) continue;

          const customSection = await prisma.resumeSection.create({
            data: {
              resumeId: newResume.id,
              sectionTitle: custom.title,
              sectionType: "other",
            },
          });

          await prisma.otherSection.create({
            data: {
              title: custom.title,
              content: custom.content,
              resumeSectionId: customSection.id,
            },
          });
        }
      }

      return NextResponse.json({ success: true, resumeId: newResume.id }, { status: 201 });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to save resume";
    console.error("Error saving resume:", error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
