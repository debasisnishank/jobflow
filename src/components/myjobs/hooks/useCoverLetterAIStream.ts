"use strict";

export async function streamCoverLetterResponse(
  requestBody: {
    resumeId: string;
    jobId: string;
    templateId?: string;
    model?: string;
  },
  setCoverLetterForm: React.Dispatch<React.SetStateAction<{
    title: string;
    content: string;
    templateId: string;
  }>>,
  coverLetterForm: {
    title: string;
    content: string;
    templateId: string;
  }
) {
  const abortController = new AbortController();

  const response = await fetch("/api/ai/cover-letter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
    signal: abortController.signal,
  });

  if (!response.body) {
    throw new Error("No response body");
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || response.statusText);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let done = false;

  while (!done && !abortController.signal.aborted) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    const chunk = decoder.decode(value, { stream: !done });
    setCoverLetterForm((prev) => ({
      ...prev,
      content: prev.content + chunk,
    }));
  }
  reader.releaseLock();
}

