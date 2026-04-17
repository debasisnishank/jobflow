import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import { promisify } from "util";

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Zod schemas for structured output
const ContactInfoSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    phone: z.string(),
    address: z.string().nullable(),
    headline: z.string().nullable(),
});

const WorkExperienceSchema = z.object({
    company: z.string(),
    jobTitle: z.string(),
    location: z.string(),
    startDate: z.string(),
    endDate: z.string().nullable(),
    description: z.string(),
    current: z.boolean(),
});

const EducationSchema = z.object({
    institution: z.string(),
    degree: z.string(),
    fieldOfStudy: z.string(),
    location: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    description: z.string().nullable(),
});

const SkillSchema = z.object({
    name: z.string(),
    level: z.string().nullable(),
    category: z.string().nullable(),
});

const CertificationSchema = z.object({
    title: z.string(),
    organization: z.string(),
    issueDate: z.string().nullable(),
    expirationDate: z.string().nullable(),
    credentialUrl: z.string().nullable(),
});

const ResumeDataSchema = z.object({
    contactInfo: ContactInfoSchema,
    summary: z.string(),
    workExperiences: z.array(WorkExperienceSchema),
    educations: z.array(EducationSchema),
    skills: z.array(SkillSchema),
    certifications: z.array(CertificationSchema),
});

export type ParsedResumeData = z.infer<typeof ResumeDataSchema>;

async function convertPdfToImages(pdfBuffer: Buffer): Promise<string[]> {
    const tmpDir = os.tmpdir();
    const baseName = `resume-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const pdfPath = path.join(tmpDir, `${baseName}.pdf`);
    const outputPrefix = path.join(tmpDir, `${baseName}-page-%03d.jpg`);

    await writeFile(pdfPath, new Uint8Array(pdfBuffer));

    return new Promise((resolve, reject) => {
        const gs = spawn("gs", [
            "-dNOPAUSE",
            "-dBATCH",
            "-sDEVICE=jpeg",
            "-r150",
            `-sOutputFile=${outputPrefix}`,
            pdfPath,
        ]);

        gs.on("close", async (code) => {
            if (code !== 0) {
                await unlink(pdfPath).catch(() => { });
                return reject(new Error(`Ghostscript exited with code ${code}`));
            }

            try {
                const files = await fs.promises.readdir(tmpDir);
                const pageFiles = files
                    .filter((f) => f.startsWith(`${baseName}-page-`) && f.endsWith(".jpg"))
                    .sort();

                const imageUrls: string[] = [];
                for (const file of pageFiles) {
                    const filePath = path.join(tmpDir, file);
                    const imageBuffer = await readFile(filePath);
                    const base64 = imageBuffer.toString("base64");
                    imageUrls.push(`data:image/jpeg;base64,${base64}`);
                    await unlink(filePath).catch(() => { });
                }

                await unlink(pdfPath).catch(() => { });
                resolve(imageUrls);
            } catch (err) {
                await unlink(pdfPath).catch(() => { });
                reject(err);
            }
        });

        gs.on("error", async (err) => {
            await unlink(pdfPath).catch(() => { });
            reject(err);
        });
    });
}

export async function parseResumeFromPdf(buffer: Buffer): Promise<ParsedResumeData> {
    let resumeText = "";
    let images: string[] = [];

    try {
        await import("pdf-parse/worker");
        const lib = await import("pdf-parse");

        try {
            const uint8Array = new Uint8Array(buffer);
            // @ts-ignore
            const parser = new lib.PDFParse({ data: uint8Array });
            const textResult = await parser.getText();
            resumeText = (textResult.text || "").replace(/\u0000/g, "").trim();
            await parser.destroy();
        } catch (e) {
            console.warn("PDFParse class method failed:", e);
        }

        try {
            images = await convertPdfToImages(buffer);
        } catch (imgError) {
            console.error("Failed to convert PDF to images:", imgError);
        }

    } catch (error: any) {
        console.error("Error extracting text:", error);
        if (images.length === 0) {
            throw new Error(`Failed to extract text or images from file: ${error.message || 'Unknown error'}`);
        }
    }

    if (!resumeText && images.length === 0) {
        throw new Error("Could not extract readable text or images from this PDF.");
    }



    const MAX_PROMPT_CHARS = 30_000;
    if (resumeText.length > MAX_PROMPT_CHARS) {
        console.log(`Text too long (${resumeText.length} chars), truncating to ${MAX_PROMPT_CHARS}`);
        resumeText = resumeText.slice(0, MAX_PROMPT_CHARS);
    }

    const systemPrompt = `You are an expert resume parser. Extract ALL information from the resume with complete accuracy.

CRITICAL INSTRUCTIONS:
1. WORK EXPERIENCE: Extract ALL job entries with complete descriptions
2. EDUCATION: Extract all educational background
3. SKILLS: Extract all listed skills
4. CERTIFICATIONS: Extract all certifications and licenses
5. CONTACT INFO: Extract name, email, phone, address, headline
6. SUMMARY: Extract professional summary or objective

VISUAL IMAGE ANALYSIS:
- You will receive both extracted text AND visual images of the resume
- If the text contains "Invalid Date" or corrupted data, USE THE IMAGES to extract the correct information
- The images show the original PDF and are the source of truth for dates and other information
- Look carefully at the images to find dates next to job titles and company names

DATE FORMATTING - VERY IMPORTANT:
- ALWAYS use "YYYY-MM" format (e.g., "2023-01", "2022-06")
- If you see "2023" only, convert to "2023-01"
- If you see "Jan 2023", convert to "2023-01"
- If you see "June 2022", convert to "2022-06"
- If you see "Present", "Current", or "Now", set endDate to null and current to true
- Month mapping: Jan=01, Feb=02, Mar=03, Apr=04, May=05, Jun=06, Jul=07, Aug=08, Sep=09, Oct=10, Nov=11, Dec=12

EXAMPLES:
- "2023 - Present" -> startDate: "2023-01", endDate: null, current: true
- "Jan 2022 - Dec 2023" -> startDate: "2022-01", endDate: "2023-12", current: false
- "2021" -> startDate: "2021-01", endDate: null (if no end date given)

Extract everything you find. Do not skip or summarize.`;

    const userContent: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [
        {
            type: "text",
            text: `RESUME TEXT:
---
${resumeText}
---

Extract ALL information from this resume into the structured format.

IMPORTANT NOTES:
1. The extracted text may have corrupted dates (e.g., "Invalid Date"). 
2. If you see "Invalid Date" in the text, you MUST look at the visual images below to find the actual dates.
3. The images show the original PDF - use them to extract the correct dates.

DATE FORMAT REMINDER: 
- ALWAYS use "YYYY-MM" format (e.g., "2023-01", "2022-06")
- Examples:
  * "2023" becomes "2023-01"
  * "Jan 2022" becomes "2022-01"
  * "June 2023" becomes "2023-06"
  * "2023 - Present" becomes startDate: "2023-01", endDate: null, current: true

${images.length > 0 ? 'VISUAL IMAGES PROVIDED BELOW - USE THESE TO EXTRACT DATES IF TEXT IS CORRUPTED:' : ''}`
        }
    ];

    const maxPages = 4;
    images.slice(0, maxPages).forEach((imgUrl) => {
        userContent.push({
            type: "image_url",
            image_url: {
                url: imgUrl,
                detail: "high",
            },
        });
    });

    const completion = await openai.beta.chat.completions.parse({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
            {
                role: "system",
                content: systemPrompt,
            },
            {
                role: "user",
                content: userContent,
            },
        ],
        response_format: zodResponseFormat(ResumeDataSchema, "resume_data"),
        temperature: 0.1,
    });

    const parsed = completion.choices[0]?.message?.parsed;

    if (!parsed) {
        throw new Error("Failed to parse resume data from AI response");
    }


    return parsed;
}
