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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useJobSourceForm } from "./hooks/useJobSourceForm";

type AddJobSourceProps = {
  reloadSources: () => Promise<void>;
};

export default function AddJobSource({ reloadSources }: AddJobSourceProps) {
  const { form, dialogOpen, setDialogOpen, isPending, openDialog, onSubmit } =
    useJobSourceForm(reloadSources);

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="h-9 gap-2"
        onClick={openDialog}
      >
        <PlusCircle className="h-4 w-4" />
        Add Source
      </Button>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Job Source</DialogTitle>
            <DialogDescription>
              Add places where you discover job opportunities (e.g., LinkedIn,
              referrals, internal portal).
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., LinkedIn, Referral, Company Careers"
                        {...field}
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
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Save
                  {isPending && <Loader className="ml-2 h-4 w-4 animate-spin" />}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

