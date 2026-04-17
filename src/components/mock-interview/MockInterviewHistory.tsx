"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MockInterviewSession } from "@/models/interview.model";
import { format } from "date-fns";
import {
  Video,
  Calendar,
  Clock,
  TrendingUp,
  Eye,
  FileText,
} from "lucide-react";
import Link from "next/link";

interface MockInterviewHistoryProps {
  sessions: MockInterviewSession[];
}

export function MockInterviewHistory({ sessions }: MockInterviewHistoryProps) {
  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Past Interviews</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No past interviews yet. Start your first mock interview above!
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "abandoned":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return "text-gray-600";
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Past Interviews</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sessions.map((session) => (
            <Card key={session.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{session.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getStatusColor(session.status)}>
                            {session.status.replace("_", " ")}
                          </Badge>
                          <Badge variant="outline">{session.interviewType}</Badge>
                          {session.videoRecordingUrl && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Video className="h-3 w-3" />
                              Video
                            </Badge>
                          )}
                          {session.transcript && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              Transcript
                            </Badge>
                          )}
                        </div>
                      </div>
                      {session.overallScore !== null && (
                        <div className="text-right">
                          <div
                            className={`text-2xl font-bold ${getScoreColor(session.overallScore)}`}
                          >
                            {session.overallScore}
                          </div>
                          <p className="text-xs text-muted-foreground">Score</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(session.startedAt), "MMM dd, yyyy")}
                      </div>
                      {session.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {session.duration} min
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        {session.questions.length} questions
                      </div>
                    </div>

                    {session.job && (
                      <div className="text-sm">
                        <span className="font-medium">Job: </span>
                        <span className="text-muted-foreground">
                          {session.job.JobTitle?.label} at {session.job.Company?.label}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="ml-4">
                    <Link href={`/dashboard/mock-interview/${session.id}`}>
                      <Button size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


