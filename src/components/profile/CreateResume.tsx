"use client";
import { Loader, FileText, Upload } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Form } from "../ui/form";
import { Resume } from "@/models/profile.model";
import { useCreateResumeForm } from "./hooks/useCreateResumeForm";
import { CreateResumeFormFields } from "./CreateResumeFormFields";

type CreateResumeProps = {
  resumeDialogOpen: boolean;
  setResumeDialogOpen: (e: boolean) => void;
  resumeToEdit?: Resume | null;
  reloadResumes: () => void;
  setNewResumeId: (id: string) => void;
};

function CreateResume({
  resumeDialogOpen,
  setResumeDialogOpen,
  resumeToEdit,
  reloadResumes,
  setNewResumeId,
}: CreateResumeProps) {
  const pageTitle = resumeToEdit ? "Edit Resume Title" : "Create Resume";

  const { form, isPending, errors, isValid, onSubmit } = useCreateResumeForm(
    resumeToEdit,
    setResumeDialogOpen,
    reloadResumes,
    setNewResumeId
  );

  const closeDialog = () => setResumeDialogOpen(false);

  return (
    <Dialog open={resumeDialogOpen} onOpenChange={setResumeDialogOpen}>
      <DialogContent className="sm:max-w-[500px] lg:max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">{pageTitle}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                {resumeToEdit 
                  ? "Update your resume title and file" 
                  : "Create a new resume with a title and optional file upload"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={(event) => {
              event.stopPropagation();
              form.handleSubmit(onSubmit)(event);
            }}
            className="space-y-6 py-4"
          >
            <CreateResumeFormFields control={form.control} errors={errors} />
            <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!isValid || isPending}
                className="w-full sm:w-auto"
              >
                {isPending ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Resume"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateResume;
