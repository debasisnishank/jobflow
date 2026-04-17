"use client";

import { Resume } from "@/models/profile.model";
import ResumeTable from "./ResumeTable";
import { Button } from "../ui/button";

interface ProfileResumeListProps {
  resumes: Resume[];
  totalResumes: number;
  page: number;
  loading: boolean;
  onEditResume: (resume: Resume) => void;
  onReloadResumes: () => void;
  onLoadMore: () => void;
}

export function ProfileResumeList({
  resumes,
  totalResumes,
  page,
  loading,
  onEditResume,
  onReloadResumes,
  onLoadMore,
}: ProfileResumeListProps) {
  return (
    <>
      <div className="rounded-lg border border-border/50 overflow-hidden">
        <ResumeTable
          resumes={resumes}
          editResume={onEditResume}
          reloadResumes={onReloadResumes}
        />
      </div>
      <div className="mt-4 text-sm text-muted-foreground flex items-center justify-between">
        <span>
          Showing{" "}
          <strong className="text-foreground">
            {1} to {resumes.length}
          </strong>{" "}
          of <strong className="text-foreground">{totalResumes}</strong> resumes
        </span>
      </div>
      {resumes.length < totalResumes && (
        <div className="flex justify-center pt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={onLoadMore}
            disabled={loading}
            className="min-w-[120px] border-[#3B82F6]/30 hover:bg-[#3B82F6] hover:text-white hover:border-[#3B82F6]"
          >
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </>
  );
}

















