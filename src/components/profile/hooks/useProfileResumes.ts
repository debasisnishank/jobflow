"use client";

import { useCallback, useEffect, useState } from "react";
import { getResumeList } from "@/actions/profile.actions";
import { Resume } from "@/models/profile.model";
import { APP_CONSTANTS } from "@/lib/constants";
import { toast } from "../../ui/use-toast";

export function useProfileResumes() {
  const recordsPerPage = APP_CONSTANTS.RECORDS_PER_PAGE;
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [resumeDialogOpen, setResumeDialogOpen] = useState(false);
  const [resumeToEdit, setResumeToEdit] = useState<Resume | null>(null);
  const [totalResumes, setTotalResumes] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const loadResumes = useCallback(
    async (page: number) => {
      setLoading(true);
      const { data, total, success, message } = await getResumeList(
        page,
        recordsPerPage
      );
      if (success && data) {
        setResumes((prev) => (page === 1 ? data : [...prev, ...data]));
        setTotalResumes(total);
        setPage(page);
        setLoading(false);
      } else {
        setLoading(false);
        return toast({
          variant: "destructive",
          title: "Error!",
          description: message,
        });
      }
    },
    [recordsPerPage]
  );

  const reloadResumes = useCallback(async () => {
    await loadResumes(1);
  }, [loadResumes]);

  useEffect(() => {
    (async () => await loadResumes(1))();
  }, [loadResumes]);

  const createResume = () => {
    setResumeToEdit(null);
    setResumeDialogOpen(true);
  };

  const onEditResume = (resume: Resume) => {
    const _resumeToEdit = {
      id: resume.id,
      title: resume.title,
      FileId: resume.FileId,
    };
    setResumeToEdit(_resumeToEdit);
    setResumeDialogOpen(true);
  };

  return {
    resumes,
    totalResumes,
    page,
    loading,
    resumeDialogOpen,
    setResumeDialogOpen,
    resumeToEdit,
    setResumeToEdit,
    loadResumes,
    reloadResumes,
    createResume,
    onEditResume,
  };
}

















