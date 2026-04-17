import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { FormControl } from "./ui/form";
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";

interface SelectOption {
  id: string;
  label?: string;
  value?: string;
  title?: string;
}

interface SelectProps<TFieldValues extends FieldValues = FieldValues, TFieldName extends Path<TFieldValues> = Path<TFieldValues>> {
  label: string;
  options: SelectOption[];
  field: ControllerRenderProps<TFieldValues, TFieldName>;
}

function SelectFormCtrl<TFieldValues extends FieldValues = FieldValues, TFieldName extends Path<TFieldValues> = Path<TFieldValues>>({ 
  label, 
  options, 
  field 
}: SelectProps<TFieldValues, TFieldName>) {
  const currentValue = field.value || "";
  
  // Ensure the value matches one of the available options
  const validValue = options?.some((opt) => opt.id === currentValue) 
    ? currentValue 
    : "";
  
  return (
    <>
      <Select
        onValueChange={(value) => {
          field.onChange(value);
        }}
        value={validValue}
        name={field.name}
      >
        <FormControl>
          <SelectTrigger aria-label={`Select ${label}`} className="w-[200px]">
            <SelectValue placeholder={`Select ${label}`} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectGroup>
            {options && options.length > 0 ? (
              options.map((option) => {
                return (
                  <SelectItem
                    key={option.id}
                    value={option.id}
                    className="capitalize"
                  >
                    {option.label ?? option.value ?? option.title}
                  </SelectItem>
                );
              })
            ) : (
              <SelectItem value="no-options" disabled>
                No options available
              </SelectItem>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}

export default SelectFormCtrl;
