"use client";

import { Check, CirclePlus, Loader } from "lucide-react";
import { ControllerRenderProps } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "./ui/scroll-area";

interface ComboBoxContentProps {
  options: any[];
  field: ControllerRenderProps<any, any>;
  creatable?: boolean;
  newOption: string;
  setNewOption: (value: string) => void;
  isPending: boolean;
  setIsPopoverOpen: (open: boolean) => void;
  onCreateOption: () => void;
}

export function ComboBoxContent({
  options,
  field,
  creatable,
  newOption,
  setNewOption,
  isPending,
  setIsPopoverOpen,
  onCreateOption,
}: ComboBoxContentProps) {
  return (
    <Command
      filter={(value, search) =>
        value.includes(search.toLowerCase()) ? 1 : 0
      }
    >
      <CommandInput
        value={newOption}
        onValueChange={(val: string) => setNewOption(val)}
        placeholder={`${creatable ? "Create or " : ""}Search ${field.name}`}
      />
      <CommandEmpty
        onClick={() => {
          onCreateOption();
          setNewOption("");
        }}
        className={cn(
          "flex cursor-pointer items-center justify-center gap-1 italic mt-2",
          !newOption && "text-muted-foreground cursor-default"
        )}
      >
        {creatable ? (
          <>
            <CirclePlus className="h-4 w-4" />
            <p>Create: </p>
            <p className="block max-w-48 truncate font-semibold text-primary">
              {newOption}
            </p>
          </>
        ) : (
          <p className="font-semibold text-primary">No source found!</p>
        )}
      </CommandEmpty>
      <ScrollArea>
        <CommandGroup>
          <CommandList className="capitalize">
            {options.map((option) => (
              <CommandItem
                value={option.value}
                key={option.id}
                onSelect={() => {
                  if (field.onChange) {
                    field.onChange(option.id);
                    setIsPopoverOpen(false);
                  }
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    option.value === field.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandList>
        </CommandGroup>
      </ScrollArea>
    </Command>
  );
}

















