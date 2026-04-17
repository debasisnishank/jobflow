"use client";

import { Interview } from "@/models/interview.model";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Calendar, Clock, MapPin, Link as LinkIcon } from "lucide-react";
import { format } from "date-fns";
import { deleteInterview } from "@/actions/interviews.actions";
import { toast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface InterviewListProps {
  interviews: Interview[];
  onEdit: (interview: Interview) => void;
  onReload: () => void;
  getInterviewTypeIcon: (type: string) => JSX.Element;
  getStatusColor: (status: string) => string;
}

export function InterviewList({
  interviews,
  onEdit,
  onReload,
  getInterviewTypeIcon,
  getStatusColor,
}: InterviewListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [interviewToDelete, setInterviewToDelete] = useState<string | null>(null);

  const handleDeleteClick = (interviewId: string) => {
    setInterviewToDelete(interviewId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!interviewToDelete) return;

    try {
      const result = await deleteInterview(interviewToDelete);
      if (result.success) {
        toast({
          title: "Success",
          description: "Interview deleted successfully",
        });
        onReload();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Failed to delete interview",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete interview",
      });
    } finally {
      setDeleteDialogOpen(false);
      setInterviewToDelete(null);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {interviews.map((interview) => (
          <div
            key={interview.id}
            className="border rounded-lg p-4 space-y-3 hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-1">
                  {getInterviewTypeIcon(interview.type)}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className={getStatusColor(interview.status)}>
                      {interview.status}
                    </Badge>
                    <Badge variant="outline">Round {interview.round}</Badge>
                    <Badge variant="outline" className="capitalize">
                      {interview.type}
                    </Badge>
                  </div>

                  {interview.scheduledDate && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(interview.scheduledDate), "MMM dd, yyyy")}
                        {interview.scheduledTime && ` at ${interview.scheduledTime}`}
                      </span>
                      {interview.duration && (
                        <>
                          <Clock className="h-4 w-4 ml-2" />
                          <span>{interview.duration} minutes</span>
                        </>
                      )}
                    </div>
                  )}

                  {interview.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{interview.location}</span>
                    </div>
                  )}

                  {interview.meetingLink && (
                    <div className="flex items-center gap-2 text-sm">
                      <LinkIcon className="h-4 w-4" />
                      <a
                        href={interview.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Meeting Link
                      </a>
                    </div>
                  )}

                  {interview.interviewers.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-medium">Interviewers:</span>
                      <span>
                        {interview.interviewers.map((i) => `${i.firstName} ${i.lastName || ""}`).join(", ")}
                        {interview.interviewerNames.length > 0 && 
                          `, ${interview.interviewerNames.join(", ")}`
                        }
                      </span>
                    </div>
                  )}

                  {interview.notes && (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Notes: </span>
                      <span className="line-clamp-2">{interview.notes}</span>
                    </div>
                  )}

                  {interview.rating && (
                    <div className="text-sm">
                      <span className="font-medium">Rating: </span>
                      <span>{interview.rating}/10</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(interview)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteClick(interview.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Interview</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this interview? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

