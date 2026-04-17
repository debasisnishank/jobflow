"use client";
import { ResumeSection } from "@/models/profile.model";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import { Form } from "../ui/form";
import { useExperienceForm } from "./hooks/useExperienceForm";
import { ExperienceFormFields } from "./ExperienceFormFields";

type AddExperienceProps = {
  resumeId: string | undefined;
  sectionId: string | undefined;
  dialogOpen: boolean;
  setDialogOpen: (e: boolean) => void;
  experienceToEdit?: ResumeSection;
};

function AddExperience({
  resumeId,
  sectionId,
  dialogOpen,
  setDialogOpen,
  experienceToEdit,
}: AddExperienceProps) {
  const pageTitle = experienceToEdit ? "Edit Experience" : "Add Experience";
  const {
    form,
    companies,
    locations,
    jobTitles,
    isPending,
    currentJobValue,
    onCurrentJob,
    onSubmit,
    isDirty,
  } = useExperienceForm({
    resumeId,
    sectionId,
    experienceToEdit,
    setDialogOpen,
  });

  const closeDialog = () => setDialogOpen(false);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="h-full md:h-[85%] lg:max-h-screen md:max-w-[40rem] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>{pageTitle}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2"
          >
            <ExperienceFormFields
              control={form.control}
              jobTitles={jobTitles}
              companies={companies}
              locations={locations}
              currentJobValue={currentJobValue ?? false}
              sectionId={sectionId}
              onCurrentJob={onCurrentJob}
            />
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
                <Button type="submit" disabled={!isDirty}>
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

export default AddExperience;
