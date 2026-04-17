"use strict";

export function useResumeDownload() {
  const handleDownloadResume = async (
    fileId: string,
    fileName?: string | null
  ) => {
    if (!fileId) return;

    const response = await fetch(
      `/api/profile/resume?fileId=${encodeURIComponent(fileId)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "resume.pdf";
      link.target = "_blank";
      link.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return {
    handleDownloadResume,
  };
}

















