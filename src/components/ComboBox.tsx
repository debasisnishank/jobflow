"use client";

import { ChevronsUpDown, Loader } from "lucide-react";
import { ControllerRenderProps } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useTransition } from "react";
import { handleCreateOption } from "./ComboBoxCreateHandler";
import { ComboBoxContent } from "./ComboBoxContent";

interface ComboboxProps {
  options: any[];
  field: ControllerRenderProps<any, any>;
  creatable?: boolean;
}

export function Combobox({ options, field, creatable }: ComboboxProps) {
  const [newOption, setNewOption] = useState<string>("");
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

  const [isPending, startTransition] = useTransition();

  const onCreateOption = () => {
    if (!newOption) return;
    startTransition(async () => {
      const response = await handleCreateOption(field.name, newOption, field);
      if (response) {
        options.unshift(response);
        field.onChange(response.id);
        setIsPopoverOpen(false);
      }
    });
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "md:w-[240px] lg:w-[280px] justify-between capitalize",
              !field.value && "text-muted-foreground"
            )}
          >
            {field.value
              ? options.find((option) => option.id === field.value)?.label
              : `Select ${field.name}`}

            {isPending ? (
              <Loader className="h-4 w-4 shrink-0 spinner" />
            ) : (
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            )}
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="md:w-[240px] lg:w-[280px] p-0">
        <ComboBoxContent
          options={options}
          field={field}
          creatable={creatable}
          newOption={newOption}
          setNewOption={setNewOption}
          isPending={isPending}
          setIsPopoverOpen={setIsPopoverOpen}
          onCreateOption={onCreateOption}
        />
      </PopoverContent>
    </Popover>
  );
}
