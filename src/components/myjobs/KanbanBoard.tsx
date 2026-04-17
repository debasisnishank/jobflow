"use client";

import { useState, useMemo } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  rectIntersection,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { JobResponse, JobStatus } from "@/models/job.model";
import { KanbanColumn } from "./KanbanColumn";
import { JobCard } from "./JobCard";
import { formatDistanceToNow } from "date-fns";

interface KanbanBoardProps {
  jobs: JobResponse[];
  statuses: JobStatus[];
  onStatusChange: (jobId: string, status: JobStatus) => void;
  onJobClick: (jobId: string) => void;
  onEditJob: (jobId: string) => void;
  onDeleteJob: (jobId: string) => void;
  searchQuery?: string;
}

const STATUS_MAPPING: Record<string, string> = {
  draft: "saved",
  applied: "applied",
  interview: "interviewing",
  offer: "offer",
  rejected: "rejected",
};

export function KanbanBoard({
  jobs,
  statuses,
  onStatusChange,
  onJobClick,
  onEditJob,
  onDeleteJob,
  searchQuery = "",
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const filteredJobs = useMemo(() => {
    if (!searchQuery) return jobs;
    const query = searchQuery.toLowerCase();
    return jobs.filter(
      (job) =>
        job.JobTitle?.label?.toLowerCase().includes(query) ||
        job.Company?.label?.toLowerCase().includes(query)
    );
  }, [jobs, searchQuery]);

  const jobsByStatus = useMemo(() => {
    const grouped: Record<string, JobResponse[]> = {};
    statuses.forEach((status) => {
      grouped[status.value] = [];
    });
    filteredJobs.forEach((job) => {
      const statusValue = job.Status?.value || "draft";
      if (grouped[statusValue]) {
        grouped[statusValue].push(job);
      }
    });
    return grouped;
  }, [filteredJobs, statuses]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const jobId = active.id as string;
    const newStatusValue = over.id as string;

    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    const newStatus = statuses.find((s) => s.value === newStatusValue);
    if (!newStatus || job.Status?.value === newStatusValue) return;

    onStatusChange(jobId, newStatus);
  };

  const activeJob = activeId ? jobs.find((job) => job.id === activeId) : null;

  const kanbanStatuses = statuses.filter(
    (status) =>
      ["draft", "applied", "interview", "offer", "rejected"].includes(
        status.value
      )
  );


  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto overflow-y-hidden h-[calc(100vh-240px)]">
        {kanbanStatuses.map((status) => {
          const statusJobs = jobsByStatus[status.value] || [];
          const displayName =
            STATUS_MAPPING[status.value] || status.label || status.value;

          return (
            <KanbanColumn
              key={status.id}
              id={status.value}
              title={displayName}
              jobCount={statusJobs.length}
            >
              <SortableContext
                items={statusJobs.map((job) => job.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {statusJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onClick={() => onJobClick(job.id)}
                      onEdit={() => onEditJob(job.id)}
                      onDelete={() => onDeleteJob(job.id)}
                      onViewDetails={() => onJobClick(job.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </KanbanColumn>
          );
        })}
      </div>
      <DragOverlay>
        {activeJob ? (
          <div className="opacity-50">
            <JobCard
              job={activeJob}
              onClick={() => {}}
              onEdit={() => {}}
              onDelete={() => {}}
              onViewDetails={() => {}}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
