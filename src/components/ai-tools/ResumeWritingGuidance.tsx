"use client";

import { BookOpen, CheckCircle2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const guidanceSections = [
  {
    title: "Resume Formatting Best Practices",
    items: [
      "Use a clean, professional font (Arial, Calibri, or Times New Roman) in 10-12pt size",
      "Maintain consistent formatting throughout (dates, bullet points, spacing)",
      "Keep margins between 0.5-1 inch on all sides",
      "Use bullet points for easy scanning by recruiters and ATS systems",
      "Limit resume length to 1-2 pages (2 pages only if you have 10+ years of experience)",
      "Save as PDF to preserve formatting across different systems",
      "Use clear section headers (Experience, Education, Skills, etc.)",
    ],
  },
  {
    title: "ATS Optimization",
    items: [
      "Include relevant keywords from the job description naturally throughout your resume",
      "Use standard section headings (Work Experience, Education, Skills)",
      "Avoid graphics, images, tables, or complex formatting that ATS can't read",
      "Use standard date formats (MM/YYYY or Month YYYY)",
      "Spell out acronyms at least once (e.g., 'Search Engine Optimization (SEO)')",
      "Avoid headers, footers, and text boxes that ATS systems may miss",
      "Use a simple, linear layout without columns or sidebars",
    ],
  },
  {
    title: "Writing Effective Bullet Points",
    items: [
      "Start each bullet with a strong action verb (e.g., 'Developed', 'Managed', 'Implemented')",
      "Use the CAR method: Context, Action, Result",
      "Quantify achievements with numbers, percentages, or dollar amounts when possible",
      "Focus on accomplishments, not just job duties",
      "Keep bullet points concise (1-2 lines each)",
      "Tailor bullet points to highlight relevant experience for each job application",
      "Use industry-specific terminology appropriately",
    ],
  },
  {
    title: "Professional Summary Section",
    items: [
      "Keep it to 2-4 sentences (50-100 words)",
      "Highlight your most relevant skills and years of experience",
      "Include your value proposition and key achievements",
      "Tailor the summary to match the job you're applying for",
      "Use keywords from the job description naturally",
      "Write in third person or first person without 'I'",
      "Focus on what you can do for the employer, not what you want",
    ],
  },
  {
    title: "Skills Section",
    items: [
      "List both hard skills (technical) and soft skills (interpersonal)",
      "Include skills mentioned in the job description",
      "Organize skills by category (Technical Skills, Languages, Certifications)",
      "Be honest about your proficiency level",
      "Update skills section regularly to reflect current abilities",
      "Include industry-specific tools and software you're familiar with",
      "Consider adding a 'Relevant Skills' section tailored to each application",
    ],
  },
  {
    title: "Work Experience",
    items: [
      "List experiences in reverse chronological order (most recent first)",
      "Include company name, job title, location, and dates of employment",
      "Focus on achievements and impact, not just responsibilities",
      "Use metrics and numbers to quantify your contributions",
      "Highlight promotions, awards, or recognition received",
      "Include relevant internships, freelance work, or volunteer experience",
      "For older positions (10+ years), you can summarize or combine multiple roles",
    ],
  },
  {
    title: "Education Section",
    items: [
      "List highest degree first, then work backwards",
      "Include institution name, degree, major/minor, and graduation date",
      "Only include GPA if it's 3.5 or higher (or if specifically requested)",
      "Include relevant coursework, honors, or academic achievements if space allows",
      "For recent graduates, education can come before experience",
      "For experienced professionals, education typically comes after experience",
      "Include certifications, licenses, or professional development courses in a separate section",
    ],
  },
  {
    title: "Common Mistakes to Avoid",
    items: [
      "Don't include personal information (age, marital status, photos)",
      "Avoid typos and grammatical errors - proofread multiple times",
      "Don't use unprofessional email addresses",
      "Avoid using 'References available upon request' (it's assumed)",
      "Don't lie or exaggerate your qualifications",
      "Avoid using passive voice - be active and direct",
      "Don't include irrelevant work experience from 15+ years ago",
      "Avoid clichés and buzzwords without substance",
    ],
  },
];

export function ResumeWritingGuidance() {
  return (
    <div className="space-y-6">
      <Card className="border border-border/70">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-base">Resume writing guidance</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Practical checklists and examples to keep your resume ATS-friendly and impact-driven.
          </p>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {guidanceSections.map((section, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-semibold">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 mt-2">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#3B82F6] mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

