import { Metadata } from "next";
import { ResumeBuilder } from "@/components/resume-builder/ResumeBuilder";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Edit Resume | AI Resume Builder",
  description: "Edit your resume with AI assistance",
};

interface ResumeBuilderPageProps {
  params: {
    id: string;
  };
}

export default async function ResumeBuilderPage({ params }: ResumeBuilderPageProps) {
  const session = await auth();

  if (!session || !session.accessToken) {
    notFound();
  }

  const userId = session.accessToken.sub;

  const profile = await prisma.profile.findFirst({
    where: { userId },
  });

  if (!profile) {
    notFound();
  }

  const resume = await prisma.resume.findFirst({
    where: {
      id: params.id,
      profileId: profile.id,
    },
    include: {
      ContactInfo: true,
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

  const skills = await prisma.skill.findMany({
    where: {
      resumeId: params.id,
    },
  });

  const resumeWithSkills = resume ? { ...resume, Skills: skills } : null;

  if (!resumeWithSkills) {
    notFound();
  }

  return <ResumeBuilder resumeData={resumeWithSkills} />;
}

