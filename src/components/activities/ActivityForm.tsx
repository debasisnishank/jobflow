"use client";

import { Button } from "../ui/button";
import { AddActivityFormSchema } from "@/models/addActivityForm.schema";
import { z } from "zod";
import { Form } from "../ui/form";
import { memo } from "react";
import { createActivity } from "@/actions/activity.actions";
import { combineDateAndTime } from "@/lib/utils";
import { differenceInMinutes } from "date-fns";
import { ActivityBasicInfoSection } from "./ActivityBasicInfoSection";
import { ActivityTimeSection } from "./ActivityTimeSection";
import { ActivityDescriptionSection } from "./ActivityDescriptionSection";
import { ActivityInfoCard } from "./ActivityInfoCard";
import { useActivityForm } from "./hooks/useActivityForm";

interface ActivityFormProps {
  onClose: () => void;
  reloadActivities: () => void;
}

const ActivityFormComponent = ({
  onClose,
  reloadActivities,
}: ActivityFormProps) => {
  const { form, activityTypes, duration } = useActivityForm();

  const onSubmit = async (data: z.infer<typeof AddActivityFormSchema>) => {
    const { startDate, startTime, endDate, endTime, ...rest } = data;
    try {
      const startDateTime = combineDateAndTime(startDate, startTime);
      const endDateTime =
        endDate && endTime ? combineDateAndTime(endDate, endTime) : null;
      const totalMinutes = endDateTime
        ? differenceInMinutes(endDateTime, startDateTime)
        : undefined;
      const payload = {
        ...rest,
        startTime: startDateTime,
        endTime: endDateTime ?? undefined,
        duration: totalMinutes,
      };
      const response = await createActivity(payload);
      onClose();
      reloadActivities();
    } catch (error) {
      // Error handled by form validation
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <ActivityInfoCard />
        <ActivityBasicInfoSection control={form.control} activityTypes={activityTypes} />
        <ActivityTimeSection control={form.control} duration={duration} />
        <ActivityDescriptionSection control={form.control} />

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/50">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto border-border/60"
            onClick={() => onClose()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
            data-testid="save-activity-btn"
          >
            Save Activity
          </Button>
        </div>
      </form>
    </Form>
  );
};

export const ActivityForm = memo(ActivityFormComponent);
ActivityForm.displayName = "ActivityForm";
