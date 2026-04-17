import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { question, answer, questionType, jobContext, resumeContext } =
      await req.json();

    if (!question || !answer) {
      return NextResponse.json(
        { error: "Question and answer are required" },
        { status: 400 }
      );
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const model = new ChatOpenAI({
      openAIApiKey: OPENAI_API_KEY,
      modelName: "gpt-4",
      temperature: 0.7,
      streaming: false,
    });

    const template = `You are an experienced technical interviewer conducting a {questionType} interview.

The candidate was asked: "{question}"

Their answer was: "{answer}"

Job Context: {jobContext}
Candidate Background: {resumeContext}

Analyze the candidate's answer and decide if follow-up questions are needed.

If the answer is:
- Too vague or lacks detail: Generate 1-2 probing follow-up questions to get more specific information
- Complete and detailed: Return an empty array (no follow-up needed)
- Demonstrates a misconception: Generate a clarifying question

Return your response as a JSON object with this structure:
{{
  "needsFollowUp": true/false,
  "reason": "Brief explanation of why follow-up is or isn't needed",
  "followUpQuestions": [
    {{
      "question": "The follow-up question text",
      "purpose": "Why this question is being asked"
    }}
  ]
}}

Important: Only generate follow-up questions if truly necessary. Most answers should not need follow-ups.`;

    const prompt = ChatPromptTemplate.fromTemplate(template);

    const chain = prompt.pipe(model as any);

    const result = await chain.invoke({
      question,
      answer,
      questionType: questionType || "general",
      jobContext: jobContext || "No specific job context provided",
      resumeContext: resumeContext || "No resume context provided",
    });

    let followUpData;
    try {
      // Extract JSON from the response
      const content = (result as any).content?.toString() || String(result);
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        followUpData = JSON.parse(jsonMatch[0]);
      } else {
        followUpData = {
          needsFollowUp: false,
          reason: "No follow-up needed",
          followUpQuestions: [],
        };
      }
    } catch (parseError) {
      console.error("Error parsing follow-up response:", parseError);
      followUpData = {
        needsFollowUp: false,
        reason: "Error parsing response",
        followUpQuestions: [],
      };
    }

    return NextResponse.json(followUpData);
  } catch (error) {
    console.error("Error generating follow-up questions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

