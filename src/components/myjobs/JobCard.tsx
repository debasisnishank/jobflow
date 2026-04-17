"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { JobResponse } from "@/models/job.model";
import { Building2, MoreVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: JobResponse;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onViewDetails: () => void;
}

export function JobCard({ job, onClick, onEdit, onDelete, onViewDetails }: JobCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getCompanyInitials = (companyName: string) => {
    return companyName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getTimeAgo = (date: Date | null) => {
    if (!date) return "Recently";
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "Recently";
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow bg-background",
        isDragging && "shadow-lg"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage
            src={job.Company?.logoUrl || undefined}
            alt={job.Company?.label}
          />
          <AvatarFallback className="bg-primary/10 text-primary">
            {job.Company?.logoUrl ? (
              <Building2 className="h-5 w-5" />
            ) : (
              getCompanyInitials(job.Company?.label || "CO")
            )}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm truncate">
            {job.JobTitle?.label || "Untitled"}
          </h4>
          <p className="text-xs text-muted-foreground truncate mt-1">
            {job.Company?.label || "Unknown Company"}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {job.createdAt
              ? `Added ${getTimeAgo(job.createdAt)}`
              : "Recently"}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            onClick={(e) => e.stopPropagation()}
            className="flex-shrink-0"
          >
            <MoreVertical className="h-4 w-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
