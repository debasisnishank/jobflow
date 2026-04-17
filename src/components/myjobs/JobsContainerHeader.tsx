"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { File, Search, Filter } from "lucide-react";
import { AddJob } from "./AddJob";
import { JobsFilterSelect } from "./JobsFilterSelect";
import { DateRangePicker } from "./DateRangePicker";
import {
  Company,
  JobLocation,
  JobResponse,
  JobSource,
  JobStatus,
  JobTitle,
} from "@/models/job.model";

interface JobsContainerHeaderProps {
  filterKey?: string;
  onFilterChange: (filterBy: string) => void;
  onDownload: () => void;
  loading: boolean;
  statuses: JobStatus[];
  companies: Company[];
  titles: JobTitle[];
  locations: JobLocation[];
  sources: JobSource[];
  editJob: JobResponse | null;
  resetEditJob: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  duration?: string;
  onDurationChange?: (duration: string) => void;
  dateRange?: { startDate?: Date; endDate?: Date };
  onDateRangeChange?: (startDate: Date | undefined, endDate: Date | undefined) => void;
}

export function JobsContainerHeader({
  filterKey,
  onFilterChange,
  onDownload,
  loading,
  statuses,
  companies,
  titles,
  locations,
  sources,
  editJob,
  resetEditJob,
  searchQuery = "",
  onSearchChange,
  duration = "all",
  onDurationChange,
  dateRange,
  onDateRangeChange,
}: JobsContainerHeaderProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const handleSearchChange = (value: string) => {
    setLocalSearchQuery(value);
    onSearchChange?.(value);
  };

  const handleDateRangeChange = (startDate: Date | undefined, endDate: Date | undefined) => {
    if (onDateRangeChange) {
      onDateRangeChange(startDate, endDate);
      if (onDurationChange) {
        onDurationChange("custom");
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My 2026 Job Search</h1>
        </div>
        <AddJob
          jobStatuses={statuses}
          companies={companies}
          jobTitles={titles}
          locations={locations}
          jobSources={sources}
          editJob={editJob}
          resetEditJob={resetEditJob}
        />
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            value={localSearchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={duration} onValueChange={onDurationChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
        {duration === "custom" && (
          <DateRangePicker
            startDate={dateRange?.startDate}
            endDate={dateRange?.endDate}
            onDateRangeChange={handleDateRangeChange}
          />
        )}
        <JobsFilterSelect filterKey={filterKey} onFilterChange={onFilterChange} />
        <Button
          size="sm"
          variant="outline"
          className="h-9 gap-2"
          disabled={loading}
          onClick={onDownload}
        >
          <File className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only">Export</span>
        </Button>
      </div>
    </div>
  );
}

