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
import { JobLocation } from "@/models/job.model";
import { useJobLocationForm } from "./hooks/useJobLocationForm";
import { JobLocationFormFields } from "./JobLocationFormFields";

type AddJobLocationProps = {
  reloadJobLocations: () => void;
  editJobLocation?: JobLocation | null;
  resetEditJobLocation: () => void;
  dialogOpen: boolean;
  setDialogOpen: (e: boolean) => void;
};

function AddJobLocation({
  reloadJobLocations,
  editJobLocation,
  resetEditJobLocation,
  dialogOpen,
  setDialogOpen,
}: AddJobLocationProps) {
  const pageTitle = editJobLocation ? "Edit Job Location" : "Add Job Location";

  const { form, isPending, formState, onSubmit, reset } = useJobLocationForm(
    editJobLocation,
    reloadJobLocations,
    setDialogOpen
  );

  const addJobLocationForm = () => {
    reset();
    resetEditJobLocation();
    setDialogOpen(true);
  };

  const closeDialog = () => setDialogOpen(false);

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="h-8 gap-1"
        onClick={addJobLocationForm}
        data-testid="add-job-location-btn"
      >
        <PlusCircle className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Add Location
        </span>
      </Button>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{pageTitle}</DialogTitle>
            <DialogDescription>
              Add a new location to your database.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <JobLocationFormFields control={form.control} />
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

export default AddJobLocation;

