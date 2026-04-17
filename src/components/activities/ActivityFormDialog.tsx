"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { ActivityForm } from "./ActivityForm";

interface ActivityFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onReload: () => void;
  trigger?: React.ReactNode;
  testId?: string;
}

export function ActivityFormDialog({
  open,
  onOpenChange,
  onClose,
  onReload,
  trigger,
  testId,
}: ActivityFormDialogProps) {
  const defaultTrigger = (
    <Button
      size="sm"
      className="h-9 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
      data-testid={testId}
    >
      <PlusCircle className="h-4 w-4" />
      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
        Add Activity
      </span>
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto border-border/50">
        <DialogHeader className="pb-4 border-b border-border/50">
          <DialogTitle className="text-xl font-bold">Add New Activity</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Track your time and productivity by logging activities
          </p>
        </DialogHeader>
        <div className="p-6">
          <ActivityForm onClose={onClose} reloadActivities={onReload} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

