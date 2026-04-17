"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Video, Phone, MapPin, Users } from "lucide-react";
import { Interview } from "@/models/interview.model";
import { getInterviewsByJobId } from "@/actions/interviews.actions";
import { InterviewList } from "./InterviewList";
import { InterviewFormDialog } from "./InterviewFormDialog";
import { toast } from "@/components/ui/use-toast";

interface InterviewsSectionProps {
  jobId: string;
}

export function InterviewsSection({ jobId }: InterviewsSectionProps) {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null);

  const loadInterviews = async () => {
    setLoading(true);
    try {
      const result = await getInterviewsByJobId(jobId);
      if (result.success) {
        setInterviews(result.data);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Failed to load interviews",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load interviews",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterviews();
  }, [jobId]);

  const handleCreateInterview = () => {
    setEditingInterview(null);
    setDialogOpen(true);
  };

  const handleEditInterview = (interview: Interview) => {
    setEditingInterview(interview);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingInterview(null);
    loadInterviews();
  };

  const getInterviewTypeIcon = (type: string) => {
    switch (type) {
      case "phone":
        return <Phone className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "onsite":
        return <MapPin className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "rescheduled":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <>
      <Card className="border-border/70 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Interviews
          </CardTitle>
          <Button size="sm" onClick={handleCreateInterview}>
            <Plus className="h-4 w-4 mr-2" />
            Add Interview
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading interviews...</div>
          ) : interviews.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No interviews scheduled yet.</p>
              <p className="text-sm mt-2">Click "Add Interview" to schedule one.</p>
            </div>
          ) : (
            <InterviewList
              interviews={interviews}
              onEdit={handleEditInterview}
              onReload={loadInterviews}
              getInterviewTypeIcon={getInterviewTypeIcon}
              getStatusColor={getStatusColor}
            />
          )}
        </CardContent>
      </Card>

      <InterviewFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        jobId={jobId}
        interview={editingInterview}
        onSuccess={handleDialogClose}
      />
    </>
  );
}

