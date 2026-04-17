"use strict";

import { useEffect, useRef, useState } from "react";
import { getResumeList } from "@/actions/profile.actions";
import { Resume } from "@/models/profile.model";
import { toast } from "@/components/ui/use-toast";

export function useJobMatchResumes() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const resumesRef = useRef<Resume[]>([]);

  const getResumes = async () => {
    try {
      const { data, total, success, message } = await getResumeList();
      if (!data || data.ResumeSections?.length === 0) {
        throw new Error("Resume content is required");
      }
      resumesRef.current = Array.isArray(data) ? data : [data];
      setResumes(Array.isArray(data) ? data : [data]);
      if (!success) {
        throw new Error(message);
      }
    } catch (error) {
      const message = "Error fetching resume list";
      const description = error instanceof Error ? error.message : message;
      toast({
        variant: "destructive",
        title: "Error!",
        description,
      });
    }
  };

  useEffect(() => {
    getResumes();
  }, []);

  return {
    resumes: resumesRef.current.length > 0 ? resumesRef.current : resumes,
  };
}

