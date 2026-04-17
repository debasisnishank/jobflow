"use client";

import { useState, useRef, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";

interface UseStreamingResponseOptions {
  onError?: (error: Error) => void;
  errorTitle?: string;
  errorMessage?: string;
}

/**
 * Shared hook for handling streaming API responses
 * Eliminates code duplication across multiple streaming hooks
 */
export function useStreamingResponse<T extends string = string>(
  options: UseStreamingResponseOptions = {}
) {
  const [content, setContent] = useState<T>("" as T);
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isReaderReleasedRef = useRef<boolean>(false);

  const cleanup = useCallback(() => {
    if (readerRef.current && !isReaderReleasedRef.current) {
      try {
        readerRef.current.releaseLock();
      } catch {
        // Reader may already be released, ignore
      }
      readerRef.current = null;
      isReaderReleasedRef.current = true;
    }
  }, []);

  const streamResponse = useCallback(
    async (url: string, body: Record<string, unknown>) => {
      try {
        setLoading(true);
        setContent("" as T);
        isReaderReleasedRef.current = false;

        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: abortController.signal,
        });

        if (!response.body) {
          setLoading(false);
          throw new Error("No response body");
        }

        if (!response.ok) {
          setLoading(false);
          // Try to parse error response
          let errorMessage = response.statusText;
          try {
            const errorData = await response.json();
            if (errorData.error) {
              errorMessage = errorData.error;
            }
          } catch {
            // If parsing fails, use statusText
          }
          throw new Error(errorMessage);
        }

        const reader = response.body.getReader();
        readerRef.current = reader;
        const decoder = new TextDecoder();
        let done = false;

        setLoading(false);
        setIsStreaming(true);

        while (!done && !abortController.signal.aborted) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;

          if (value) {
            const chunk = decoder.decode(value, { stream: !done });
            // Remove unnecessary JSON.parse(JSON.stringify()) - chunk is already a string
            setContent((prev) => (prev + chunk) as T);
          }
        }

        cleanup();
        setIsStreaming(false);
      } catch (error) {
        const message = options.errorMessage || "Error processing request";
        const description =
          error instanceof Error ? error.message : message;

        setLoading(false);
        setIsStreaming(false);
        cleanup();

        // Only show toast if not aborted
        if (error instanceof Error && error.name !== "AbortError") {
          if (options.onError) {
            options.onError(error);
          } else {
            toast({
              variant: "destructive",
              title: options.errorTitle || "Error!",
              description,
            });
          }
        }
      }
    },
    [cleanup, options]
  );

  const abortStream = useCallback(async () => {
    abortControllerRef.current?.abort();
    setIsStreaming(false);

    if (readerRef.current && !isReaderReleasedRef.current) {
      try {
        await readerRef.current.cancel();
      } catch {
        // Reader may already be released or canceled, ignore error
      } finally {
        readerRef.current = null;
        isReaderReleasedRef.current = true;
      }
    }
  }, []);

  return {
    content,
    loading,
    isStreaming,
    streamResponse,
    abortStream,
  };
}
