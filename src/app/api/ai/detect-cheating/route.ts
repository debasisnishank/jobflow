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

    const { transcript, questions, answers, behaviorMetrics } =
      await req.json();

    if (!transcript && !questions) {
      return NextResponse.json(
        { error: "Transcript or questions data is required" },
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
      temperature: 0.3,
      streaming: false,
    });

    // Prepare Q&A pairs for analysis
    const qaText =
      questions && answers
        ? questions
            .map((q: string, i: number) => {
              return `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i] || "No answer provided"}`;
            })
            .join("\n\n")
        : transcript || "";

    const template = `You are an AI proctoring system analyzing a mock interview for potential academic dishonesty or cheating indicators.

Interview Transcript/Q&A:
{qaText}

Behavior Metrics (if available):
{behaviorMetrics}

Analyze the interview for the following indicators:

1. **Response Timing**: Unusually fast responses that suggest reading from notes
2. **Consistency**: Inconsistencies in knowledge depth or contradictions
3. **Language Patterns**: Overly formal or scripted language that suggests reading
4. **Background Activity**: Multiple people detected, background voices, or suspicious noises
5. **Attention Patterns**: Frequent looking away from screen, loss of eye contact
6. **Answer Quality**: Answers that seem copy-pasted or rehearsed word-for-word

Provide a comprehensive analysis in JSON format:
{{
  "overallRiskLevel": "low" | "medium" | "high",
  "confidenceScore": 0-100,
  "detectedIssues": [
    {{
      "category": "Response Timing" | "Consistency" | "Language Patterns" | "Background Activity" | "Attention Patterns" | "Answer Quality",
      "severity": "low" | "medium" | "high",
      "description": "Detailed description of the issue",
      "timestamp": "If applicable, when in the interview this occurred",
      "evidence": "Specific examples or data points"
    }}
  ],
  "legitimateExplanations": [
    "Possible non-cheating explanations for flagged behaviors"
  ],
  "recommendations": [
    "Suggestions for the candidate or review process"
  ],
  "summary": "Brief overall assessment"
}}

Be fair and consider legitimate reasons for unusual patterns. Flag only clear indicators.`;

    const prompt = ChatPromptTemplate.fromTemplate(template);

    const chain = prompt.pipe(model as any);

    const result = await chain.invoke({
      qaText,
      behaviorMetrics: behaviorMetrics
        ? JSON.stringify(behaviorMetrics, null, 2)
        : "No behavior metrics available",
    });

    let cheatingAnalysis;
    try {
      const content = (result as any).content?.toString() || String(result);
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cheatingAnalysis = JSON.parse(jsonMatch[0]);
      } else {
        cheatingAnalysis = {
          overallRiskLevel: "low",
          confidenceScore: 0,
          detectedIssues: [],
          legitimateExplanations: [],
          recommendations: [],
          summary: "Unable to analyze",
        };
      }
    } catch (parseError) {
      console.error("Error parsing cheating analysis:", parseError);
      cheatingAnalysis = {
        overallRiskLevel: "low",
        confidenceScore: 0,
        detectedIssues: [],
        legitimateExplanations: ["Error in analysis"],
        recommendations: ["Manual review recommended"],
        summary: "Analysis error occurred",
      };
    }

    return NextResponse.json(cheatingAnalysis);
  } catch (error) {
    console.error("Error detecting cheating:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

