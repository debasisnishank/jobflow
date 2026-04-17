"use strict";
"use server";

import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Resume } from "@/models/profile.model";
import { JobResponse } from "@/models/job.model";
import { CoverLetterTemplate } from "@/models/coverLetter.model";
import { convertJobToText, convertResumeToText } from "@/utils/ai.utils";
import { ExternalServiceError } from "@/lib/errors";
import { getAIConfigWithDefaults } from "@/lib/admin/ai-config-helper";

export const getResumeReviewByOpenAi = async (
  resume: Resume,
  aImodel?: string
): Promise<ReadableStream | undefined> => {
  const config = await getAIConfigWithDefaults("resume-review");
  console.log('aimodel', aImodel)
  const modelName = aImodel || config.modelName;

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "{system_prompt}"],
    [
      "human",
      `Review the resume provided below and and provide feedback in the specified JSON format.

{resume}`,
    ],
  ]);

  const resumeText = await convertResumeToText(resume);

  if (!process.env.OPENAI_API_KEY) {
    throw new ExternalServiceError(
      "OPENAI_API_KEY is not configured. Please set it in your environment variables.",
      {
        context: { provider: "OpenAI", function: "getResumeReviewByOpenAi" },
      }
    );
  }

  const model = new ChatOpenAI({
    modelName,
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: config.temperature,
    maxConcurrency: 1,
    maxTokens: config.maxTokens,
  });

  const chain = prompt.pipe(model as any).pipe(new StringOutputParser());
  const stream = await chain.stream({
    resume: resumeText,
    system_prompt: config.systemPrompt
  });

  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });
};

export const getJobMatchByOpenAi = async (
  resume: Resume,
  job: JobResponse,
  aiModel?: string
): Promise<ReadableStream | undefined> => {
  const resumeText = await convertResumeToText(resume);
  const jobText = await convertJobToText(job);
  const config = await getAIConfigWithDefaults("resume-job-match");
  const modelName = aiModel || config.modelName;

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "{system_prompt}"],
    [
      "human",
      `
      Please analyze the following resume and job description.

      Resume:
      """
      {resume}
      """

      Job Description:
      """
      {job_description}
      """
    `,
    ],
  ]);

  if (!process.env.OPENAI_API_KEY) {
    throw new ExternalServiceError(
      "OPENAI_API_KEY is not configured. Please set it in your environment variables.",
      {
        context: { provider: "OpenAI", function: "getJobMatchByOpenAi" },
      }
    );
  }

  const model = new ChatOpenAI({
    modelName,
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: config.temperature,
    maxConcurrency: 1,
    maxTokens: config.maxTokens,
  });

  const chain = prompt.pipe(model as any).pipe(new StringOutputParser());
  const stream = await chain.stream({
    resume: resumeText || "No resume provided",
    job_description: jobText,
    system_prompt: config.systemPrompt,
  });
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });
};

export const generateCoverLetterByOpenAI = async (
  resume: Resume,
  job: JobResponse,
  template?: CoverLetterTemplate,
  aiModel?: string
): Promise<ReadableStream | undefined> => {
  const resumeText = await convertResumeToText(resume);
  const jobText = await convertJobToText(job);
  const config = await getAIConfigWithDefaults("resume-cover-letter");
  const modelName = aiModel || config.modelName;

  const templateContext = template
    ? `\n\nUse the following template as a guide for structure and tone:\n${template.content}`
    : "";

  const systemPrompt = `${config.systemPrompt}${templateContext}`;

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "{system_prompt}"],
    [
      "human",
      `
Please write a cover letter for the following position:

Job Details:
"""
${jobText}
"""

Candidate Resume:
"""
${resumeText}
"""

Write a compelling cover letter that connects the candidate's experience with the job requirements.
    `,
    ],
  ]);

  if (!process.env.OPENAI_API_KEY) {
    throw new ExternalServiceError(
      "OPENAI_API_KEY is not configured. Please set it in your environment variables.",
      {
        context: { provider: "OpenAI", function: "generateCoverLetterByOpenAI" },
      }
    );
  }

  const model = new ChatOpenAI({
    modelName,
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: config.temperature,
    maxConcurrency: 1,
    maxTokens: config.maxTokens,
  });

  const chain = prompt.pipe(model as any).pipe(new StringOutputParser());
  const stream = await chain.stream({
    resume: resumeText || "No resume provided",
    job_description: jobText,
    system_prompt: systemPrompt,
  });

  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });
};
