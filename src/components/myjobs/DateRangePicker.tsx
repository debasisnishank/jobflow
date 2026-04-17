"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";

interface DateRangePickerProps {
  startDate?: Date;
  endDate?: Date;
  onDateRangeChange: (startDate: Date | undefined, endDate: Date | undefined) => void;
}

export function DateRangePicker({
  startDate,
  endDate,
  onDateRangeChange,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const dateRange: DateRange | undefined = startDate || endDate
    ? {
        from: startDate,
        to: endDate,
      }
    : undefined;

  const handleSelect = (range: DateRange | undefined) => {
    if (!range) {
      onDateRangeChange(undefined, undefined);
      return;
    }

    if (range.from && range.to) {
      onDateRangeChange(range.from, range.to);
      setIsOpen(false);
    } else if (range.from) {
      onDateRangeChange(range.from, undefined);
    } else {
      onDateRangeChange(undefined, undefined);
    }
  };

  const handleClear = () => {
    onDateRangeChange(undefined, undefined);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "w-[240px] justify-start text-left font-normal gap-2",
            !startDate && !endDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="h-4 w-4" />
          {startDate && endDate ? (
            <>
              {format(startDate, "MMM dd")} - {format(endDate, "MMM dd")}
            </>
          ) : startDate ? (
            <>
              {format(startDate, "MMM dd")} - ...
            </>
          ) : (
            <span>Custom Date Range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 space-y-3">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={handleSelect}
            numberOfMonths={2}
            className="rounded-md border"
          />
          <div className="flex items-center justify-between border-t pt-3">
            <div className="text-sm text-muted-foreground">
              {startDate && endDate && (
                <span>
                  {format(startDate, "MMM dd, yyyy")} - {format(endDate, "MMM dd, yyyy")}
                </span>
              )}
              {startDate && !endDate && (
                <span>Select end date</span>
              )}
              {!startDate && !endDate && (
                <span>Select date range</span>
              )}
            </div>
            {(startDate || endDate) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-8 px-2"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
