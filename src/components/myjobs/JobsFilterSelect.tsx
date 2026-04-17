"use client";

import { ListFilter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface JobsFilterSelectProps {
  filterKey?: string;
  onFilterChange: (filterBy: string) => void;
}

export function JobsFilterSelect({
  filterKey,
  onFilterChange,
}: JobsFilterSelectProps) {
  return (
    <Select value={filterKey} onValueChange={onFilterChange}>
      <SelectTrigger className="w-[140px] h-9 border-border/60 bg-background">
        <ListFilter className="h-4 w-4 mr-2" />
        <SelectValue placeholder="Filter" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Filter by</SelectLabel>
          <SelectSeparator />
          <SelectItem value="none">None</SelectItem>
          <SelectItem value="applied">Applied</SelectItem>
          <SelectItem value="interview">Interview</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
          <SelectItem value="PT">Part-time</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

















