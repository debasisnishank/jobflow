"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/DatePicker";
import { Interview, InterviewForm } from "@/models/interview.model";
import { createInterview, updateInterview } from "@/actions/interviews.actions";
import { getContactsList } from "@/actions/contacts.actions";
import { Contact } from "@/models/contact.model";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const interviewFormSchema = z.object({
  type: z.enum(["phone", "video", "onsite", "other"]),
  round: z.number().min(1),
  status: z.enum(["scheduled", "completed", "cancelled", "rescheduled", "no_show"]),
  scheduledDate: z.date().nullable(),
  scheduledTime: z.string().nullable(),
  duration: z.number().nullable(),
  location: z.string().nullable(),
  meetingLink: z.string().url().nullable().or(z.literal("")),
  notes: z.string().nullable(),
  questions: z.array(z.string()),
  feedback: z.string().nullable(),
  rating: z.number().min(0).max(10).nullable(),
  outcome: z.enum(["positive", "negative", "neutral", "pending"]).nullable(),
  interviewerIds: z.array(z.string()),
  interviewerNames: z.array(z.string()),
  preparationNotes: z.string().nullable(),
});

type InterviewFormValues = z.infer<typeof interviewFormSchema>;

interface InterviewFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  interview?: Interview | null;
  onSuccess: () => void;
}

export function InterviewFormDialog({
  open,
  onOpenChange,
  jobId,
  interview,
  onSuccess,
}: InterviewFormDialogProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionInput, setQuestionInput] = useState("");

  const form = useForm<InterviewFormValues>({
    resolver: zodResolver(interviewFormSchema),
    defaultValues: {
      type: "phone",
      round: 1,
      status: "scheduled",
      scheduledDate: null,
      scheduledTime: null,
      duration: null,
      location: null,
      meetingLink: null,
      notes: null,
      questions: [],
      feedback: null,
      rating: null,
      outcome: null,
      interviewerIds: [],
      interviewerNames: [],
      preparationNotes: null,
    },
  });

  useEffect(() => {
    if (open) {
      loadContacts();
      if (interview) {
        form.reset({
          type: interview.type,
          round: interview.round,
          status: interview.status as any,
          scheduledDate: interview.scheduledDate ? new Date(interview.scheduledDate) : null,
          scheduledTime: interview.scheduledTime || null,
          duration: interview.duration || null,
          location: interview.location || null,
          meetingLink: interview.meetingLink || null,
          notes: interview.notes || null,
          questions: interview.questions || [],
          feedback: interview.feedback || null,
          rating: interview.rating || null,
          outcome: interview.outcome || null,
          interviewerIds: interview.interviewers.map((i) => i.id),
          interviewerNames: interview.interviewerNames || [],
          preparationNotes: interview.preparationNotes || null,
        });
      } else {
        form.reset({
          type: "phone",
          round: 1,
          status: "scheduled",
          scheduledDate: null,
          scheduledTime: null,
          duration: null,
          location: null,
          meetingLink: null,
          notes: null,
          questions: [],
          feedback: null,
          rating: null,
          outcome: null,
          interviewerIds: [],
          interviewerNames: [],
          preparationNotes: null,
        });
      }
    }
  }, [open, interview]);

  const loadContacts = async () => {
    setLoadingContacts(true);
    try {
      const result = await getContactsList(1, 100);
      if (result.success) {
        setContacts(result.data);
      }
    } catch (error) {
      // Silently fail - contacts are optional
    } finally {
      setLoadingContacts(false);
    }
  };

  const onSubmit = async (data: InterviewFormValues) => {
    setIsSubmitting(true);
    try {
      const formData: InterviewForm = {
        jobId,
        interviewerIds: data.interviewerIds,
        type: data.type,
        round: data.round,
        status: data.status,
        scheduledDate: data.scheduledDate,
        scheduledTime: data.scheduledTime,
        duration: data.duration,
        location: data.location || null,
        meetingLink: data.meetingLink || null,
        notes: data.notes || null,
        questions: data.questions,
        feedback: data.feedback || null,
        rating: data.rating || null,
        outcome: data.outcome || null,
        interviewerNames: data.interviewerNames,
        preparationNotes: data.preparationNotes || null,
      };

      const result = interview
        ? await updateInterview(interview.id, formData)
        : await createInterview(formData);

      if (result.success) {
        toast({
          title: "Success",
          description: interview ? "Interview updated successfully" : "Interview created successfully",
        });
        onSuccess();
        onOpenChange(false);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Failed to save interview",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save interview",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addQuestion = () => {
    if (questionInput.trim()) {
      const currentQuestions = form.getValues("questions") || [];
      form.setValue("questions", [...currentQuestions, questionInput.trim()]);
      setQuestionInput("");
    }
  };

  const removeQuestion = (index: number) => {
    const currentQuestions = form.getValues("questions") || [];
    form.setValue("questions", currentQuestions.filter((_, i) => i !== index));
  };

  const questions = form.watch("questions") || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{interview ? "Edit Interview" : "Add Interview"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interview Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="onsite">On-site</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="round"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Round</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="rescheduled">Rescheduled</SelectItem>
                        <SelectItem value="no_show">No Show</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scheduledTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time (HH:MM)</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="scheduledDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scheduled Date</FormLabel>
                  <DatePicker field={field} presets={false} isEnabled={true} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="meetingLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meeting Link</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://..."
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preparationNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preparation Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notes to prepare for the interview..."
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interview Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notes from the interview..."
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Questions Asked</FormLabel>
              <div className="flex gap-2">
                <Input
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addQuestion();
                    }
                  }}
                  placeholder="Add a question..."
                />
                <Button type="button" onClick={addQuestion} variant="outline">
                  Add
                </Button>
              </div>
              {questions.length > 0 && (
                <div className="space-y-1">
                  {questions.map((q, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <span className="flex-1">{q}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeQuestion(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating (0-10)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="10"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="outcome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Outcome</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select outcome" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="positive">Positive</SelectItem>
                        <SelectItem value="negative">Negative</SelectItem>
                        <SelectItem value="neutral">Neutral</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feedback</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Interview feedback..."
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {interview ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

