"use client";

import { useDroppable } from "@dnd-kit/core";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  id: string;
  title: string;
  jobCount: number;
  children: React.ReactNode;
}

export function KanbanColumn({
  id,
  title,
  jobCount,
  children,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div 
      className="flex-shrink-0 w-[280px] h-[calc(100vh-240px)] flex flex-col" 
      ref={setNodeRef}
    >
      <Card
        className={cn(
          "h-full w-full border-2 transition-colors flex flex-col",
          isOver && "border-primary bg-primary/5"
        )}
        style={{
          backgroundColor: '#f0f7ff',
          backgroundImage: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0'
        }}
      >
        <div className="p-4 border-b bg-white/50 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm uppercase tracking-wide">
              {title}
            </h3>
            <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full">
              {jobCount} {jobCount === 1 ? "Job" : "Jobs"}
            </span>
          </div>
        </div>
        <div className="p-4 space-y-3 overflow-y-auto flex-1 min-h-0 relative min-h-[200px]">
          {children}
         
        </div>
      </Card>
    </div>
  );
}
