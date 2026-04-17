"use client";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Loader, PlusCircle } from "lucide-react";
import { Form } from "../ui/form";
import { JobTitle } from "@prisma/client";
import { useJobTitleForm } from "./hooks/useJobTitleForm";
import { JobTitleFormFields } from "./JobTitleFormFields";

type AddJobTitleProps = {
  reloadJobTitles: () => void;
  editJobTitle?: JobTitle | null;
  resetEditJobTitle: () => void;
  dialogOpen: boolean;
  setDialogOpen: (e: boolean) => void;
};

function AddJobTitle({
  reloadJobTitles,
  editJobTitle,
  resetEditJobTitle,
  dialogOpen,
  setDialogOpen,
}: AddJobTitleProps) {
  const pageTitle = editJobTitle ? "Edit Job Title" : "Add Job Title";

  const { form, isPending, formState, onSubmit, reset } = useJobTitleForm(
    editJobTitle,
    reloadJobTitles,
    setDialogOpen
  );

  const addJobTitleForm = () => {
    reset();
    resetEditJobTitle();
    setDialogOpen(true);
  };

  const closeDialog = () => setDialogOpen(false);

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="h-8 gap-1"
        onClick={addJobTitleForm}
        data-testid="add-job-title-btn"
      >
        <PlusCircle className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Add Job Title
        </span>
      </Button>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{pageTitle}</DialogTitle>
            <DialogDescription>
              Add a new job title to your database.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <JobTitleFormFields control={form.control} />
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeDialog}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={!formState.isDirty}>
                  Save
                  {isPending && (
                    <Loader className="ml-2 h-4 w-4 shrink-0 spinner" />
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddJobTitle;

