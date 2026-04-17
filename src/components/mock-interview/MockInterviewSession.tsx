"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowRight, CheckCircle2, XCircle, MessageSquare } from "lucide-react";
import { MockInterviewSession as SessionType, MockInterviewQuestion } from "@/models/interview.model";
import { addMockInterviewQuestion, updateMockInterviewQuestion, updateMockInterviewSession } from "@/actions/interviews.actions";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { VideoInterviewRoom } from "./VideoInterviewRoom";

interface MockInterviewSessionProps {
  session: SessionType;
  onComplete: (session: SessionType) => void;
  onCancel: () => void;
}

export function MockInterviewSession({
  session,
  onComplete,
  onCancel,
}: MockInterviewSessionProps) {
  const [questions, setQuestions] = useState<MockInterviewQuestion[]>(session.questions || []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [isGettingFeedback, setIsGettingFeedback] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<any>(null);
  const [isWaitingForNextQuestion, setIsWaitingForNextQuestion] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  // Video interview states
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [transcriptSegments, setTranscriptSegments] = useState<any[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const analyserDataRef = useRef<Uint8Array | null>(null);
  const rafRef = useRef<number | null>(null);
  const rollingChunksRef = useRef<Blob[]>([]);
  const speakingChunksRef = useRef<Blob[]>([]);
  const audioSamplesRef = useRef<Float32Array[]>([]);
  const rollingSamplesRef = useRef<Float32Array[]>([]);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const vadRef = useRef<{ isSpeaking: boolean; silenceMs: number; lastTs: number; speechStartMs: number | null; consecutiveSpeechSamples: number }>({
    isSpeaking: false,
    silenceMs: 0,
    lastTs: 0,
    speechStartMs: null,
    consecutiveSpeechSamples: 0,
  });
  const transcriptionActiveRef = useRef(false);
  const transcribeQueueRef = useRef<Promise<void>>(Promise.resolve());
  const [micError, setMicError] = useState<string | null>(null);
  const currentAnswerRef = useRef("");

  // Generation guards to prevent duplicate calls
  const isGeneratingRef = useRef(false);
  const hasStartedRef = useRef(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const allQuestionsAnswered = questions.every(q => q.userAnswer);

  useEffect(() => {
    // Generate first question ONCE on mount
    if (questions.length === 0 && !hasStartedRef.current) {
      hasStartedRef.current = true;
      console.log('[MockInterview] Initializing first question...');
      generateNextQuestion();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (currentQuestion?.userAnswer) {
      setCurrentAnswer(currentQuestion.userAnswer);
    } else {
      setCurrentAnswer("");
    }
    currentAnswerRef.current = (currentQuestion?.userAnswer || "").toString();
    setShowFeedback(false);
    setCurrentFeedback(null);
  }, [currentQuestionIndex, currentQuestion]);

  const appendWithDedupe = (prev: string, next: string) => {
    const cleanPrev = (prev || "").trim();
    const cleanNext = (next || "").trim();
    if (!cleanNext) return cleanPrev;
    if (!cleanPrev) return cleanNext;

    // Dedupe by word overlap (avoid repeated chunks like "thank you thank you")
    const prevWords = cleanPrev.split(/\s+/);
    const nextWords = cleanNext.split(/\s+/);
    const maxOverlap = Math.min(18, prevWords.length, nextWords.length);
    for (let k = maxOverlap; k >= 3; k--) {
      const tail = prevWords.slice(-k).join(" ").toLowerCase();
      const head = nextWords.slice(0, k).join(" ").toLowerCase();
      if (tail === head) {
        return `${cleanPrev} ${nextWords.slice(k).join(" ")}`.trim();
      }
    }
    if (cleanPrev.toLowerCase().endsWith(cleanNext.toLowerCase())) return cleanPrev;
    return `${cleanPrev} ${cleanNext}`.trim();
  };

  const stopRealtimeTranscription = () => {
    transcriptionActiveRef.current = false;
    setIsSpeaking(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try { mediaRecorderRef.current.stop(); } catch { }
    }
    mediaRecorderRef.current = null;
    rollingChunksRef.current = [];
    speakingChunksRef.current = [];
    audioSamplesRef.current = [];
    rollingSamplesRef.current = [];
    vadRef.current = { isSpeaking: false, silenceMs: 0, lastTs: 0, speechStartMs: null, consecutiveSpeechSamples: 0 };
    if (scriptProcessorRef.current) {
      try {
        scriptProcessorRef.current.disconnect();
      } catch { }
      scriptProcessorRef.current = null;
    }
    if (audioContextRef.current) {
      try { audioContextRef.current.close(); } catch { }
    }
    audioContextRef.current = null;
    analyserRef.current = null;
    analyserDataRef.current = null;
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
    setIsListening(false);
  };

  const convertToWav = async (audioBlob: Blob): Promise<Blob> => {
    try {
      const arrayBuffer = await audioBlob.arrayBuffer();

      if (arrayBuffer.byteLength >= 4) {
        const firstBytes = new Uint8Array(arrayBuffer.slice(0, 4));
        if (firstBytes[0] === 0x52 && firstBytes[1] === 0x49 && firstBytes[2] === 0x46 && firstBytes[3] === 0x46) {
          console.log("Audio is already WAV format");
          return new Blob([arrayBuffer], { type: "audio/wav" });
        }
      }

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      let audioBuffer: AudioBuffer;

      try {
        audioBuffer = await audioContext.decodeAudioData(arrayBuffer.slice(0));
      } catch (decodeError) {
        console.error("Failed to decode audio data - file might be incomplete:", decodeError);
        throw new Error(`Audio decode failed: ${decodeError instanceof Error ? decodeError.message : 'Unknown error'}. The recording might be incomplete.`);
      }

      const wav = audioBufferToWav(audioBuffer);
      const wavBlob = new Blob([wav], { type: "audio/wav" });

      if (wavBlob.size === 0) {
        throw new Error("WAV conversion produced empty file");
      }

      const wavFirstBytes = new Uint8Array(await wavBlob.slice(0, 4).arrayBuffer());
      if (wavFirstBytes[0] !== 0x52 || wavFirstBytes[1] !== 0x49 || wavFirstBytes[2] !== 0x46 || wavFirstBytes[3] !== 0x46) {
        throw new Error("WAV conversion failed - output doesn't have WAV header");
      }

      console.log(`Successfully converted audio to WAV: ${audioBlob.size} bytes -> ${wavBlob.size} bytes`);
      return wavBlob;
    } catch (error) {
      console.error("Failed to convert to WAV:", error);
      throw error;
    }
  };

  const audioBufferToWav = (buffer: AudioBuffer): ArrayBuffer => {
    const length = buffer.length;
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const bytesPerSample = 2;
    const blockAlign = numberOfChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = length * blockAlign;
    const bufferSize = 44 + dataSize;

    const arrayBuffer = new ArrayBuffer(bufferSize);
    const view = new DataView(arrayBuffer);

    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, "RIFF");
    view.setUint32(4, bufferSize - 8, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true);
    writeString(36, "data");
    view.setUint32(40, dataSize, true);

    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }
    }

    return arrayBuffer;
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    let fileToSend: File;

    try {
      const wavBlob = await convertToWav(audioBlob);
      const firstBytes = new Uint8Array(await wavBlob.slice(0, 4).arrayBuffer());
      if (firstBytes[0] === 0x52 && firstBytes[1] === 0x49 && firstBytes[2] === 0x46 && firstBytes[3] === 0x46) {
        fileToSend = new File([wavBlob], "audio.wav", { type: "audio/wav" });
        console.log("Successfully converted to WAV format");
      } else {
        throw new Error("WAV conversion produced invalid file");
      }
    } catch (error) {
      console.warn("WAV conversion failed, sending original format:", error);
      const originalType = audioBlob.type || "audio/webm";
      const normalizedType = originalType.split(";")[0].trim().toLowerCase();
      const ext = normalizedType === "audio/webm" ? "webm" :
        normalizedType === "audio/ogg" ? "ogg" : "webm";
      fileToSend = new File([audioBlob], `audio.${ext}`, { type: normalizedType });
    }

    const formData = new FormData();
    formData.append("audio", fileToSend);
    const response = await fetch("/api/ai/transcribe", { method: "POST", body: formData });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error || "Transcription failed");
    }
    return response.json();
  };

  const startRealtimeTranscription = async () => {
    if (transcriptionActiveRef.current) return;
    transcriptionActiveRef.current = true;
    setMicError(null);

    try {
      if (!micStreamRef.current) {
        micStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = true));
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Microphone permission denied";
      setMicError(msg);
      transcriptionActiveRef.current = false;
      return;
    }

    // MediaRecorder chunking + VAD (pause detection). We keep mic on, but only transcribe when speech ends.
    const stream = micStreamRef.current;
    if (!stream) return;

    const pickMimeType = () => {
      if (typeof MediaRecorder === "undefined") return "";
      const isSupported = (t: string) => (MediaRecorder as any).isTypeSupported?.(t);
      const candidates = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
        "audio/ogg;codecs=opus",
        "audio/ogg",
      ];
      return candidates.find((t) => isSupported(t)) || "";
    };

    const mimeType = pickMimeType();

    const recorder = mimeType ? new MediaRecorder(stream, { mimeType } as any) : new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    setIsListening(true);

    recorder.ondataavailable = (event) => {
      if (!event.data || event.data.size === 0) return;

      // Keep a small rolling buffer for pre-roll (helps not cut first words)
      rollingChunksRef.current.push(event.data);
      const MAX_ROLLING = 10; // ~2.5s at 250ms
      if (rollingChunksRef.current.length > MAX_ROLLING) {
        rollingChunksRef.current.splice(0, rollingChunksRef.current.length - MAX_ROLLING);
      }

      if (vadRef.current.isSpeaking) {
        speakingChunksRef.current.push(event.data);
      }
    };

    const finalizeSpeechSegment = () => {
      const samples = audioSamplesRef.current;
      const totalLength = samples.reduce((sum, arr) => sum + arr.length, 0);
      const audioCtx = audioContextRef.current;
      const minSamples = audioCtx ? (audioCtx.sampleRate * MIN_SPEECH_DURATION_MS / 1000) : 16000;

      if (samples.length > 0 && totalLength >= minSamples) {
        const audioCtx = audioContextRef.current;
        if (audioCtx) {
          const mergedSamples = new Float32Array(totalLength);
          let offset = 0;
          for (const sampleArray of samples) {
            mergedSamples.set(sampleArray, offset);
            offset += sampleArray.length;
          }

          const audioBuffer = audioCtx.createBuffer(1, totalLength, audioCtx.sampleRate);
          audioBuffer.copyToChannel(mergedSamples, 0);

          const wav = audioBufferToWav(audioBuffer);
          const wavBlob = new Blob([wav], { type: "audio/wav" });
          audioSamplesRef.current = [];
          speakingChunksRef.current = [];
          rollingChunksRef.current = [];
          rollingSamplesRef.current = [];

          transcribeQueueRef.current = transcribeQueueRef.current.then(async () => {
            try {
              setIsTranscribing(true);
              const fileToSend = new File([wavBlob], "audio.wav", { type: "audio/wav" });
              const formData = new FormData();
              formData.append("audio", fileToSend);
              const response = await fetch("/api/ai/transcribe", { method: "POST", body: formData });
              if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err?.error || "Transcription failed");
              }
              const data = await response.json();
              const text = (data?.text || "").toString().trim();

              if (text && text.length > 3) {
                const lowerText = text.toLowerCase().trim();
                const shortFalsePositives = [
                  'thank you', 'thanks', 'okay', 'ok', 'uh', 'um', 'ah', 'eh',
                  'bye', 'bye bye', 'goodbye', 'hello', 'hi', 'hey', 'yum',
                  'a a a', 'peace out', 'i love you', 'don\'t don\'t'
                ];

                const isShortFalsePositive = shortFalsePositives.some(fp => {
                  const trimmed = lowerText.trim();
                  return trimmed === fp || trimmed === fp + '.' || trimmed === fp + '!';
                });

                if (!isShortFalsePositive || text.length > 15) {
                  setTranscript((prev) => appendWithDedupe(prev, text));
                  setTranscriptSegments((prev) => [...prev, ...(data?.segments || [])]);
                  const nextAnswer = appendWithDedupe(currentAnswerRef.current, text);
                  currentAnswerRef.current = nextAnswer;
                  setCurrentAnswer(nextAnswer);
                }
              }
            } catch (e) {
              const msg = e instanceof Error ? e.message : "Transcription error";
              setMicError(msg);
            } finally {
              setIsTranscribing(false);
            }
          });
          return;
        }
      }

      const chunks = speakingChunksRef.current;
      if (!chunks.length) {
        audioSamplesRef.current = [];
        return;
      }

      const chunkType = (chunks[0] as any)?.type || mimeType || "audio/webm";
      const baseType = (chunkType || "audio/webm").split(";")[0].trim().toLowerCase();
      const blob = new Blob(chunks, { type: baseType });

      const minSize = 4096;
      if (blob.size < minSize) {
        speakingChunksRef.current = [];
        rollingChunksRef.current = [];
        audioSamplesRef.current = [];
        rollingSamplesRef.current = [];
        return;
      }

      speakingChunksRef.current = [];
      rollingChunksRef.current = [];
      audioSamplesRef.current = [];
      rollingSamplesRef.current = [];

      transcribeQueueRef.current = transcribeQueueRef.current.then(async () => {
        try {
          setIsTranscribing(true);
          const data = await transcribeAudio(blob);
          const text = (data?.text || "").toString().trim();

          if (text && text.length > 5) {
            const lowerText = text.toLowerCase().trim();
            const commonFalsePositives = [
              'thank you', 'thanks', 'okay', 'ok', 'uh', 'um', 'ah', 'eh',
              'bye', 'bye bye', 'goodbye', 'see you', 'talk to you',
              'hello', 'hi', 'hey', 'yum', 'a a a', 'peace out',
              'i love you', 'don\'t don\'t', 'subscribe', 'like comment share'
            ];
            const isFalsePositive = commonFalsePositives.some(fp => {
              const pattern = new RegExp(`\\b${fp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
              return pattern.test(lowerText) && text.length < 50;
            });

            if (!isFalsePositive) {
              setTranscript((prev) => appendWithDedupe(prev, text));
              setTranscriptSegments((prev) => [...prev, ...(data?.segments || [])]);
              const nextAnswer = appendWithDedupe(currentAnswerRef.current, text);
              currentAnswerRef.current = nextAnswer;
              setCurrentAnswer(nextAnswer);
            }
          }
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Transcription error";
          setMicError(msg);
        } finally {
          setIsTranscribing(false);
        }
      });
    };

    // VAD loop (simple RMS)
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = audioCtx;
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.8;
    analyserRef.current = analyser;
    analyserDataRef.current = new Uint8Array(analyser.fftSize);
    source.connect(analyser);

    try {
      const scriptProcessor = audioCtx.createScriptProcessor(4096, 1, 1);
      const dummyGain = audioCtx.createGain();
      dummyGain.gain.value = 0;
      dummyGain.connect(audioCtx.destination);

      scriptProcessor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const sampleCopy = new Float32Array(inputData);
        const outputData = e.outputBuffer.getChannelData(0);
        outputData.set(inputData);

        rollingSamplesRef.current.push(sampleCopy);
        const MAX_ROLLING_SAMPLES = 10;
        if (rollingSamplesRef.current.length > MAX_ROLLING_SAMPLES) {
          rollingSamplesRef.current.splice(0, rollingSamplesRef.current.length - MAX_ROLLING_SAMPLES);
        }

        if (vadRef.current.isSpeaking) {
          if (audioSamplesRef.current.length === 0 && rollingSamplesRef.current.length > 0) {
            audioSamplesRef.current = [...rollingSamplesRef.current];
          }
          audioSamplesRef.current.push(sampleCopy);
          const MAX_SAMPLES = 100;
          if (audioSamplesRef.current.length > MAX_SAMPLES) {
            audioSamplesRef.current.splice(0, audioSamplesRef.current.length - MAX_SAMPLES);
          }
        }
      };
      source.connect(scriptProcessor);
      scriptProcessor.connect(dummyGain);
      scriptProcessorRef.current = scriptProcessor;
    } catch (e) {
      console.warn("ScriptProcessorNode not supported, falling back to MediaRecorder only:", e);
    }

    const SILENCE_END_MS = 1500;
    const THRESHOLD = 0.08;
    const MIN_SPEECH_DURATION_MS = 1500;
    const MIN_SPEECH_SAMPLES = 3;

    const tick = (ts: number) => {
      if (!transcriptionActiveRef.current) return;
      const data = analyserDataRef.current;
      if (!data || !analyserRef.current) return;

      (analyserRef.current as any).getByteTimeDomainData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / data.length);

      const last = vadRef.current.lastTs || ts;
      const dt = ts - last;
      vadRef.current.lastTs = ts;

      if (rms > THRESHOLD) {
        vadRef.current.consecutiveSpeechSamples++;
        if (!vadRef.current.isSpeaking) {
          if (vadRef.current.consecutiveSpeechSamples >= MIN_SPEECH_SAMPLES) {
            vadRef.current.isSpeaking = true;
            vadRef.current.silenceMs = 0;
            vadRef.current.speechStartMs = ts;
            setIsSpeaking(true);
            speakingChunksRef.current = [...rollingChunksRef.current];
          }
        } else {
          vadRef.current.silenceMs = 0;
        }
      } else {
        vadRef.current.consecutiveSpeechSamples = 0;
        if (vadRef.current.isSpeaking) {
          vadRef.current.silenceMs += dt;
          if (vadRef.current.silenceMs >= SILENCE_END_MS) {
            const speechDuration = vadRef.current.speechStartMs ? ts - vadRef.current.speechStartMs : 0;
            vadRef.current.isSpeaking = false;
            vadRef.current.silenceMs = 0;
            vadRef.current.speechStartMs = null;
            vadRef.current.consecutiveSpeechSamples = 0;
            setIsSpeaking(false);

            if (speechDuration >= MIN_SPEECH_DURATION_MS) {
              finalizeSpeechSegment();
            } else {
              speakingChunksRef.current = [];
              audioSamplesRef.current = [];
            }
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    // Start recording with timeslices so we can build pause-delimited segments.
    try {
      recorder.start(250);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to start microphone recorder";
      setMicError(msg);
      transcriptionActiveRef.current = false;
      setIsListening(false);
    }
  };

  useEffect(() => {
    const answered = !!currentQuestion?.userAnswer;
    if (answered) {
      stopRealtimeTranscription();
      return;
    }
    // Auto-start mic + transcription for each question
    startRealtimeTranscription();
    return () => {
      stopRealtimeTranscription();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex, currentQuestion?.id]);

  const flushAndStopForSubmit = async (): Promise<void> => {
    // If user is currently speaking, force-finalize the segment immediately.
    // We request the last chunk first while "speaking" is still true so it gets included.
    if (vadRef.current.isSpeaking) {
      try {
        mediaRecorderRef.current?.requestData?.();
      } catch { }
      await new Promise<void>((resolve) => setTimeout(resolve, 120));
      vadRef.current.isSpeaking = false;
      setIsSpeaking(false);
    }

    // If there is an in-progress speech segment, enqueue one last transcription before stopping.
    if (speakingChunksRef.current.length) {
      const chunks = speakingChunksRef.current;
      speakingChunksRef.current = [];
      rollingChunksRef.current = [];
      const blob = new Blob(chunks, { type: "audio/webm" });

      transcribeQueueRef.current = transcribeQueueRef.current.then(async () => {
        if (blob.size < 2048) return;
        try {
          setIsTranscribing(true);
          const data = await transcribeAudio(blob);
          const text = (data?.text || "").toString().trim();

          if (text && text.length > 5) {
            const lowerText = text.toLowerCase().trim();

            // More comprehensive false positive detection
            const fillerPhrases = [
              'thank you', 'thanks', 'okay', 'ok', 'uh', 'um', 'ah', 'eh',
              'bye', 'bye bye', 'goodbye', 'see you', 'talk to you', 'bye-bye',
              'hello', 'hi', 'hey', 'yum', 'a a a', 'peace out', 'hold on',
              'i love you', 'don\'t don\'t', 'subscribe', 'like comment share',
              'i think that\'s all', 'that\'s all', 'yep', 'yeah', 'yes', 'no',
              'can you show', 'just move it', 'it\'s on the screen', 'any questions'
            ];

            // Check if text is mostly filler
            const words = text.split(/\s+/);
            const fillerWordCount = words.filter((word: string) => {
              const w = word.toLowerCase().replace(/[.,!?]/g, '');
              return fillerPhrases.some(fp => fp.includes(w) || w.length <= 2);
            }).length;

            const fillerRatio = fillerWordCount / words.length;

            // Filter out if:
            // 1. Text is very short and matches filler phrases
            // 2. More than 60% of words are filler
            // 3. Text is just repeated phrases (e.g., "I think that's all" x5)
            const hasRepeatedPhrases = /(.{10,})\1{2,}/.test(text);
            const isMostlyFiller = fillerRatio > 0.6;
            const isShortFiller = text.length < 50 && fillerPhrases.some(fp =>
              lowerText.includes(fp)
            );

            const isFalsePositive = isShortFiller || isMostlyFiller || hasRepeatedPhrases;

            if (!isFalsePositive) {
              setTranscript((prev) => appendWithDedupe(prev, text));
              setTranscriptSegments((prev) => [...prev, ...(data?.segments || [])]);
              const nextAnswer = appendWithDedupe(currentAnswerRef.current, text);
              currentAnswerRef.current = nextAnswer;
              setCurrentAnswer(nextAnswer);
            }
          }
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Transcription error";
          setMicError(msg);
        } finally {
          setIsTranscribing(false);
        }
      });
    }

    stopRealtimeTranscription();

    // Wait for queued transcriptions to finish (bounded)
    try {
      await Promise.race([
        transcribeQueueRef.current,
        new Promise<void>((resolve) => setTimeout(resolve, 8000)),
      ]);
    } catch {
      // ignore; we still submit what we have
    }
  };

  const persistCurrentAnswerIfNeeded = async (): Promise<boolean> => {
    if (!currentQuestion) return false;
    if (currentQuestion.userAnswer) return true;

    await flushAndStopForSubmit();
    const answer = currentAnswerRef.current.trim();
    if (!answer) {
      toast({
        variant: "destructive",
        title: "Answer required",
        description: "Please answer the question before moving forward.",
      });
      return false;
    }

    const answeredAt = new Date();
    await updateMockInterviewQuestion(currentQuestion.id, {
      userAnswer: answer,
      answeredAt,
    });

    setQuestions((prev) =>
      prev.map((q) => (q.id === currentQuestion.id ? { ...q, userAnswer: answer, answeredAt } : q))
    );
    return true;
  };

  const generateNextQuestion = async (isFollowUp = false, parentQuestionId: string | null = null) => {
    // LOCK: Prevent concurrent calls
    if (isGeneratingRef.current || isGeneratingQuestion) {
      console.log('[MockInterview] Generation already in progress, skipping duplicate call');
      return false;
    }

    isGeneratingRef.current = true;
    setIsGeneratingQuestion(true);

    try {
      const previousQuestions = questions.map(q => q.question);
      const previousAnswers = questions.map(q => q.userAnswer || "");

      const requestBody: any = {
        sessionId: session.id,
        jobId: session.jobId || undefined,
        resumeId: session.resumeId || undefined,
        interviewType: session.interviewType,
        previousQuestions,
        previousAnswers,
        isFollowUp,
      };

      if (isFollowUp && parentQuestionId) {
        const parentQ = questions.find(q => q.id === parentQuestionId);
        if (parentQ) {
          requestBody.parentQuestion = parentQ.question;
          requestBody.parentAnswer = parentQ.userAnswer || "";
        }
      }

      // Calculate time tracking
      const startTime = new Date(session.startedAt);
      const currentTime = new Date();
      const elapsedMinutes = Math.round((currentTime.getTime() - startTime.getTime()) / 1000 / 60);
      const totalDuration = session.duration || 45; // Default to 45 min if not set
      const remainingMinutes = Math.max(0, totalDuration - elapsedMinutes);

      // Pass time info to AI for smart decision making
      requestBody.elapsedMinutes = elapsedMinutes;
      requestBody.remainingMinutes = remainingMinutes;
      requestBody.totalDuration = totalDuration;
      requestBody.currentQuestionCount = questions.length;

      const response = await fetch("/api/ai/mock-interview/generate-next-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        let errorMessage = `Failed to generate question: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If response is not JSON, try to get text
          try {
            const errorText = await response.text();
            if (errorText) errorMessage = errorText;
          } catch {
            // Use default error message
          }
        }
        throw new Error(errorMessage);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullResponse += decoder.decode(value);
        }
      }

      if (!fullResponse || fullResponse.trim().length === 0) {
        throw new Error("Empty response from server");
      }

      // Parse JSON from response
      let questionData;
      try {
        // Try to extract JSON from markdown code blocks first
        const jsonMatch = fullResponse.match(/```json\s*([\s\S]*?)\s*```/) ||
          fullResponse.match(/```\s*([\s\S]*?)\s*```/);
        let jsonString = jsonMatch ? jsonMatch[1] : fullResponse;

        // Sanitize the JSON string to fix common issues        jsonString = jsonString.trim();

        // Remove any trailing commas before closing braces/brackets
        jsonString = jsonString.replace(/,\s*([}\]])/g, '$1');

        // Fix unterminated decimal numbers (e.g., "1." -> "1.0")
        jsonString = jsonString.replace(/(\d+)\.(\s*[,}\]])/g, '$1.0$2');

        // Remove any control characters that might break parsing
        jsonString = jsonString.replace(/[\x00-\x1F\x7F]/g, '');

        questionData = JSON.parse(jsonString);
      } catch (parseError) {
        console.error("Failed to parse question response:", parseError);
        console.error("Response content:", fullResponse);
        throw new Error(`Failed to parse question data: ${parseError instanceof Error ? parseError.message : "Unknown parsing error"}`);
      }

      // Validate question data
      if (!questionData || typeof questionData !== "object") {
        throw new Error("Invalid question data format");
      }

      // If follow-up question is null, it means no follow-up is needed
      if (isFollowUp && (!questionData.question || questionData.question === null)) {
        setIsGeneratingQuestion(false);
        return false; // No follow-up needed
      }

      // Validate that we have a question
      if (!questionData.question || questionData.question.trim().length === 0) {
        throw new Error("Generated question is empty");
      }

      // Create question record in database
      // Calculate order based on current number of questions
      const nextOrder = questions.length + 1;

      const result = await addMockInterviewQuestion(session.id, {
        question: questionData.question.trim(),
        questionType: questionData.questionType || "other",
        order: nextOrder,
        isFollowUp: questionData.isFollowUp || false,
        parentQuestionId: parentQuestionId || null,
      });

      if (result.success && result.data) {
        setQuestions(prev => [...prev, result.data!]);
        setCurrentQuestionIndex(questions.length); // Move to the new question
        return true;
      } else {
        throw new Error(result.message || "Failed to save question to database");
      }
    } catch (error: any) {
      console.error("Error generating question:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to generate question",
      });
      return false;
    } finally {
      isGeneratingRef.current = false;
      setIsGeneratingQuestion(false);
    }
  };

  // Note: no manual "Submit Answer" in a real interview.
  // Answers are auto-submitted when the user moves forward.

  const getFeedback = async (answerText: string) => {
    if (!currentQuestion || !answerText.trim()) return;

    setIsGettingFeedback(true);
    try {
      // Get job and resume data for context
      let jobDescription = "";
      let resumeData = "";

      if (session.job) {
        jobDescription = session.job.description || "";
      }

      // For now, we'll use a simplified approach - in production, fetch full resume data
      if (session.resume) {
        resumeData = `Resume: ${session.resume.title}`;
      }

      const response = await fetch("/api/ai/mock-interview/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQuestion.question,
          questionType: currentQuestion.questionType,
          userAnswer: answerText.trim(),
          jobDescription,
          resumeData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get feedback");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullResponse += decoder.decode(value);
        }
      }

      // Parse feedback JSON
      let feedbackData;
      try {
        const jsonMatch = fullResponse.match(/```json\s*([\s\S]*?)\s*```/) ||
          fullResponse.match(/```\s*([\s\S]*?)\s*```/);
        const jsonString = jsonMatch ? jsonMatch[1] : fullResponse;
        feedbackData = JSON.parse(jsonString.trim());
      } catch {
        feedbackData = JSON.parse(fullResponse.trim());
      }

      // Update question with feedback
      await updateMockInterviewQuestion(currentQuestion.id, {
        aiFeedback: feedbackData.feedback,
        score: feedbackData.score,
        strengths: feedbackData.strengths || [],
        suggestions: feedbackData.suggestions || [],
      });

      // Update local state (but don't show feedback during interview)
      const updatedQuestions = questions.map((q) =>
        q.id === currentQuestion.id
          ? {
            ...q,
            aiFeedback: feedbackData.feedback,
            score: feedbackData.score,
            strengths: feedbackData.strengths || [],
            suggestions: feedbackData.suggestions || [],
          }
          : q
      );
      setQuestions(updatedQuestions);

      // Don't show feedback during interview - only in results
      // setCurrentFeedback(feedbackData);
      // setShowFeedback(true);
    } catch (error: any) {
      console.error("Error getting feedback:", error);
      // Don't show error toast during interview to avoid interruption
    } finally {
      setIsGettingFeedback(false);
    }
  };

  const handleNext = async () => {
    if (!currentQuestion) return;

    stopRealtimeTranscription();
    setIsSubmittingAnswer(true);
    try {
      const ok = await persistCurrentAnswerIfNeeded();
      if (!ok) {
        setIsSubmittingAnswer(false);
        return;
      }

      // Don't generate feedback here - only on completion

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsSubmittingAnswer(false);
        return;
      }

      setIsWaitingForNextQuestion(true);
      await generateNextQuestion(false);
      setIsWaitingForNextQuestion(false);
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex <= 0) return;
    // Allow revisiting answered questions only (read-only).
    if (!currentQuestion?.userAnswer) return;
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const handleComplete = async () => {
    if (!currentQuestion) return;

    stopRealtimeTranscription();

    try {
      setIsSubmittingAnswer(true);

      // Ensure last question is persisted before completing.
      let updatedCurrentQuestion = currentQuestion;
      const currentAns = currentAnswerRef.current.trim();

      if (!currentQuestion.userAnswer && currentAns) {
        const ok = await persistCurrentAnswerIfNeeded();
        if (!ok) {
          setIsSubmittingAnswer(false);
          return;
        }
        // Update the local reference to reflect the saved answer
        updatedCurrentQuestion = { ...currentQuestion, userAnswer: currentAns };

        // Generate final feedback
        try {
          await getFeedback(currentAns);
        } catch (e) {
          console.error("Final feedback generation failed", e);
        }
      } else if (currentQuestion.userAnswer && !currentQuestion.aiFeedback) {
        // If answer exists but no feedback yet (e.g. they clicked previous then complete)
        try {
          await getFeedback(currentQuestion.userAnswer);
        } catch (e) {
          console.error("Final feedback generation failed", e);
        }
      }

      // Check all questions including the just-saved one
      const allQuestions = questions.map((q) =>
        q.id === updatedCurrentQuestion.id ? updatedCurrentQuestion : q
      );

      // Hard rule (real interview): you can't finish with unanswered questions.
      const hasUnanswered = allQuestions.some((q) => !q.userAnswer);
      if (hasUnanswered) {
        const unansweredCount = allQuestions.filter((q) => !q.userAnswer).length;
        toast({
          variant: "destructive",
          title: "Incomplete interview",
          description: `Please answer all questions before completing the interview. ${unansweredCount} question(s) still need answers.`,
        });
        setIsSubmittingAnswer(false);
        return;
      }

      // Generate feedback for ALL answered questions NOW (at completion only)
      console.log("Generating feedback for all questions at completion...");
      const feedbackPromises = allQuestions
        .filter(q => q.userAnswer && !q.aiFeedback) // Only generate if missing
        .map(async (q) => {
          try {
            await getFeedback(q.userAnswer!);
          } catch (e) {
            console.error(`Failed to generate feedback for question ${q.id}:`, e);
          }
        });

      // Wait for all feedback to complete (with timeout)
      await Promise.race([
        Promise.all(feedbackPromises),
        new Promise((resolve) => setTimeout(resolve, 30000)) // 30s timeout
      ]);
      console.log("Feedback generation completed.");

      // Calculate overall score and feedback
      const answeredQuestions = allQuestions.filter(q => q.userAnswer);
      const avgScore = answeredQuestions.length > 0
        ? Math.round(answeredQuestions.reduce((sum, q) => sum + (q.score || 0), 0) / answeredQuestions.length)
        : 0;

      const allStrengths = answeredQuestions.flatMap(q => q.strengths || []);
      const allSuggestions = answeredQuestions.flatMap(q => q.suggestions || []);

      const startTime = new Date(session.startedAt);
      const duration = Math.round((new Date().getTime() - startTime.getTime()) / 1000 / 60);

      // Run cheating detection (video interview is always enabled)
      let cheatingAnalysis = null;
      if (transcript) {
        try {
          const response = await fetch("/api/ai/detect-cheating", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              transcript,
              questions: questions.map(q => q.question),
              answers: questions.map(q => q.userAnswer || ""),
              behaviorMetrics: {}, // We can add face detection metrics here later
            }),
          });

          if (response.ok) {
            cheatingAnalysis = await response.json();
          }
        } catch (error) {
          console.error("Error detecting cheating:", error);
        }
      }

      const result = await updateMockInterviewSession(session.id, {
        status: "completed",
        completedAt: new Date(),
        duration,
        overallScore: avgScore,
        strengths: Array.from(new Set(allStrengths)),
        improvements: Array.from(new Set(allSuggestions)),
        overallFeedback: `You completed ${answeredQuestions.length} questions with an average score of ${avgScore}/100.`,
        transcript: transcript || undefined,
        transcriptSegments: transcriptSegments.length > 0 ? JSON.stringify(transcriptSegments) : undefined,
        cheatingAnalysis: cheatingAnalysis ? JSON.stringify(cheatingAnalysis) : undefined,
      });

      if (result.success && result.data) {
        onComplete(result.data);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to complete interview",
      });
    }
  };

  if (isGeneratingQuestion && questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Preparing your interview...</p>
      </div>
    );
  }

  if (questions.length === 0 && !isGeneratingQuestion) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription>
            No questions generated. Please try again.
          </AlertDescription>
        </Alert>
        <Button onClick={() => generateNextQuestion()} className="w-full">
          <Loader2 className="mr-2 h-4 w-4" />
          Retry Generating Question
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{session.title}</h2>
          <p className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel Interview
          </Button>
        </div>
      </div>

      <VideoInterviewRoom sessionId={session.id} onLeave={onCancel} />

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">
                {currentQuestion?.question}
              </CardTitle>
              <Badge variant="outline" className="mt-2">
                {currentQuestion?.questionType}
              </Badge>
            </div>
            {currentQuestion?.userAnswer && (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <label className="text-sm font-medium">Your Answer (voice only)</label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${isListening ? "bg-green-500 animate-pulse" : "bg-gray-300"
                      }`}
                  />
                  {isTranscribing ? "Transcribing..." : isListening ? "Listening..." : "Starting mic..."}
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4">
              {micError ? (
                <div className="text-sm text-red-600">
                  {micError}{" "}
                  <button
                    className="underline"
                    onClick={() => startRealtimeTranscription()}
                    type="button"
                  >
                    Retry
                  </button>
                </div>
              ) : currentAnswer?.trim() ? (
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{currentAnswer}</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Start answering out loud. Your speech will be transcribed in real time.
                </p>
              )}
            </div>
          </div>



          {isWaitingForNextQuestion && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Preparing next question...
            </div>
          )}

          {showFeedback && currentFeedback && (
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  AI Feedback
                  {currentFeedback.score !== undefined && (
                    <Badge variant="secondary" className="ml-auto">
                      Score: {currentFeedback.score}/100
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentFeedback.feedback && (
                  <p className="text-sm">{currentFeedback.feedback}</p>
                )}

                {currentFeedback.strengths && currentFeedback.strengths.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-green-600">Strengths:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {currentFeedback.strengths.map((s: string, i: number) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentFeedback.suggestions && currentFeedback.suggestions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-blue-600">Suggestions:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {currentFeedback.suggestions.map((s: string, i: number) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={
                currentQuestionIndex === 0 ||
                !currentQuestion?.userAnswer ||
                isSubmittingAnswer ||
                isTranscribing ||
                isListening ||
                isWaitingForNextQuestion ||
                isGeneratingQuestion
              }
            >
              Previous
            </Button>

            {/* Show Complete button only after 8 questions, otherwise show Next */}
            {questions.length >= 8 ? (
              <Button
                onClick={handleComplete}
                disabled={
                  (!currentQuestion?.userAnswer && !currentAnswerRef.current.trim() && !currentAnswer.trim()) ||
                  isSubmittingAnswer ||
                  isWaitingForNextQuestion ||
                  isGeneratingQuestion
                }
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmittingAnswer ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Finalizing...
                  </>
                ) : (
                  "Complete Interview"
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={
                  (!currentQuestion?.userAnswer && !currentAnswerRef.current.trim() && !currentAnswer.trim()) ||
                  isSubmittingAnswer ||
                  isWaitingForNextQuestion ||
                  isGeneratingQuestion
                }
              >
                {isWaitingForNextQuestion ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating next question...
                  </>
                ) : isSubmittingAnswer ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving & Next
                  </>
                ) : (
                  <>
                    Next Question
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

