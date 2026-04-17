"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, TrendingUp, MessageSquare, Sparkles, ArrowLeft, Video, FileText } from "lucide-react";
import { MockInterviewSession } from "@/models/interview.model";
import { format } from "date-fns";
import { CheatingAnalysis } from "./CheatingAnalysis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

interface MockInterviewResultsProps {
  session: MockInterviewSession;
  onNewInterview?: () => void;
  showVideo?: boolean;
}

export function MockInterviewResults({
  session,
  onNewInterview,
  showVideo = false,
}: MockInterviewResultsProps) {
  const answeredQuestions = session.questions.filter(q => q.userAnswer);
  const avgScore = session.overallScore || 
    (answeredQuestions.length > 0
      ? Math.round(answeredQuestions.reduce((sum, q) => sum + (q.score || 0), 0) / answeredQuestions.length)
      : 0);
  
  const cheatingAnalysis = session.cheatingAnalysis
    ? typeof session.cheatingAnalysis === "string"
      ? JSON.parse(session.cheatingAnalysis)
      : session.cheatingAnalysis
    : null;
  
  const transcriptSegments = session.transcriptSegments
    ? typeof session.transcriptSegments === "string"
      ? JSON.parse(session.transcriptSegments)
      : session.transcriptSegments
    : [];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Interview Complete!</h2>
          <p className="text-sm text-muted-foreground">
            Completed on {format(new Date(session.completedAt || new Date()), "MMM dd, yyyy 'at' h:mm a")}
          </p>
        </div>
        <div className="flex gap-2">
          {!onNewInterview && (
            <Link href="/dashboard/mock-interview">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Interviews
              </Button>
            </Link>
          )}
          {onNewInterview && (
            <Button onClick={onNewInterview}>
              <Sparkles className="mr-2 h-4 w-4" />
              New Interview
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overall Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" style={{ color: getScoreColor(avgScore) }}>
              {avgScore}/100
            </div>
            <Badge variant={getScoreBadgeVariant(avgScore)} className="mt-2">
              {avgScore >= 80 ? "Excellent" : avgScore >= 60 ? "Good" : "Needs Improvement"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Questions Answered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {answeredQuestions.length}/{session.questions.length}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {Math.round((answeredQuestions.length / session.questions.length) * 100)}% completion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {session.duration || 0}
            </div>
            <p className="text-sm text-muted-foreground mt-2">minutes</p>
          </CardContent>
        </Card>
      </div>

      {/* Video Recording and Transcript */}
      {(showVideo && session.videoRecordingUrl) || session.transcript ? (
        <Tabs defaultValue="feedback" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            {showVideo && session.videoRecordingUrl && (
              <TabsTrigger value="video">
                <Video className="h-4 w-4 mr-2" />
                Video
              </TabsTrigger>
            )}
            {session.transcript && (
              <TabsTrigger value="transcript">
                <FileText className="h-4 w-4 mr-2" />
                Transcript
              </TabsTrigger>
            )}
            {cheatingAnalysis && (
              <TabsTrigger value="integrity">Integrity</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="feedback" className="space-y-4 mt-4">
            {session.overallFeedback && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Overall Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{session.overallFeedback}</p>
                </CardContent>
              </Card>
            )}
            <FeedbackSection session={session} />
          </TabsContent>

          {showVideo && session.videoRecordingUrl && (
            <TabsContent value="video" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Interview Recording</CardTitle>
                </CardHeader>
                <CardContent>
                  <video
                    controls
                    className="w-full rounded-lg"
                    src={session.videoRecordingUrl}
                  >
                    Your browser does not support the video tag.
                  </video>
                  {session.videoDuration && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Duration: {Math.floor(session.videoDuration / 60)}:
                      {String(session.videoDuration % 60).padStart(2, "0")}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {session.transcript && (
            <TabsContent value="transcript" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Interview Transcript</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    {transcriptSegments.length > 0 ? (
                      <div className="space-y-2">
                        {transcriptSegments.map((segment: any, index: number) => (
                          <div key={index} className="border-l-2 border-primary pl-3">
                            <p className="text-xs text-muted-foreground">
                              {new Date(segment.start * 1000).toISOString().substr(14, 5)}
                            </p>
                            <p className="text-sm">{segment.text}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap text-sm">{session.transcript}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {cheatingAnalysis && (
            <TabsContent value="integrity" className="mt-4">
              <CheatingAnalysis analysis={cheatingAnalysis} />
            </TabsContent>
          )}
        </Tabs>
      ) : (
        <>
          {session.overallFeedback && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Overall Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{session.overallFeedback}</p>
              </CardContent>
            </Card>
          )}
          <FeedbackSection session={session} />
        </>
      )}


      {onNewInterview && (
        <div className="flex justify-center">
          <Button onClick={onNewInterview} size="lg">
            <Sparkles className="mr-2 h-4 w-4" />
            Start Another Interview
          </Button>
        </div>
      )}
    </div>
  );
}

// Helper component for feedback sections
function FeedbackSection({ session }: { session: MockInterviewSession }) {
  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  return (
    <>
      {session.strengths && session.strengths.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              Key Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {session.strengths.map((strength, index) => (
                <li key={index} className="text-sm">{strength}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {session.improvements && session.improvements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <TrendingUp className="h-5 w-5" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {session.improvements.map((improvement, index) => (
                <li key={index} className="text-sm">{improvement}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Question-by-Question Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {session.questions.map((question, index) => (
              <div
                key={question.id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Question {index + 1}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {question.questionType}
                      </Badge>
                      {question.score !== null && (
                        <Badge
                          variant={getScoreBadgeVariant(question.score)}
                          className="text-xs"
                        >
                          {question.score}/100
                        </Badge>
                      )}
                    </div>
                    <p className="font-medium">{question.question}</p>
                  </div>
                </div>

                {question.userAnswer && (
                  <div className="bg-muted/50 rounded p-3">
                    <p className="text-sm font-medium mb-1">Your Answer:</p>
                    <p className="text-sm">{question.userAnswer}</p>
                  </div>
                )}

                {question.aiFeedback && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">AI Feedback:</p>
                    <p className="text-sm text-muted-foreground">{question.aiFeedback}</p>

                    {question.strengths && question.strengths.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-green-600 mb-1">Strengths:</p>
                        <ul className="list-disc list-inside text-xs text-muted-foreground">
                          {question.strengths.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {question.suggestions && question.suggestions.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-blue-600 mb-1">Suggestions:</p>
                        <ul className="list-disc list-inside text-xs text-muted-foreground">
                          {question.suggestions.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

