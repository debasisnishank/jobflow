import { Paperclip } from "lucide-react";

export function DownloadFileButton(
  fileId: string | null | undefined,
  fileTitle: string,
  fileName: string
) {
  const handleDownload = async () => {
    if (!fileId) {
      return;
    }

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
      link.download = fileName;
      link.target = "_blank";
      link.click();
      window.URL.revokeObjectURL(url); // Clean up
    } else {
      // File download failed - error handled silently
    }
  };

  return (
    <button
      className="flex items-center"
      onClick={handleDownload}
      title={`Download ${fileName}`}
      disabled={!fileId}
    >
      <div>{fileTitle}</div>
      <Paperclip className="h-3.5 w-3.5 ml-1" />
    </button>
  );
}
