"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { Loader } from "lucide-react";
import { ResumeSection } from "@/models/profile.model";
import { useResumeSummaryForm } from "./hooks/useResumeSummaryForm";
import { ResumeSummaryFormFields } from "./ResumeSummaryFormFields";

interface AddResumeSummaryProps {
  resumeId: string | undefined;
  dialogOpen: boolean;
  setDialogOpen: (e: boolean) => void;
  summaryToEdit?: ResumeSection | null;
}

function AddResumeSummary({
  resumeId,
  dialogOpen,
  setDialogOpen,
  summaryToEdit,
}: AddResumeSummaryProps) {
  const pageTitle = summaryToEdit ? "Edit Summary" : "Add Summary";

  const { form, isPending, formState, onSubmit } = useResumeSummaryForm(
    resumeId,
    summaryToEdit,
    setDialogOpen
  );

  const closeDialog = () => setDialogOpen(false);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="lg:max-h-screen overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>{pageTitle}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2"
          >
            <ResumeSummaryFormFields control={form.control} />
            <div className="md:col-span-2 mt-4">
              <DialogFooter>
                <div>
                  <Button
                    type="reset"
                    variant="outline"
                    className="mt-2 md:mt-0 w-full"
                    onClick={closeDialog}
                  >
                    Cancel
                  </Button>
                </div>
                <Button type="submit" disabled={!formState.isDirty}>
                  Save
                  {isPending && <Loader className="h-4 w-4 shrink-0 spinner" />}
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddResumeSummary;
