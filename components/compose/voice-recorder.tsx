"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Mic, Square, RotateCcw } from "lucide-react";
import { validateMediaFile } from "@/lib/validations/message";

const MAX_SECONDS = 60;
const BAR_COUNT = 8;

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VoiceRecorder({
  file,
  onFileChange,
  onError,
}: {
  file: File | null;
  onFileChange: (file: File | null) => void;
  onError: (message: string) => void;
}) {
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [bars, setBars] = useState<number[]>(Array(BAR_COUNT).fill(0.15));

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const cleanup = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioCtxRef.current?.close().catch(() => {});
    rafRef.current = null;
    timerRef.current = null;
    streamRef.current = null;
    audioCtxRef.current = null;
    analyserRef.current = null;
  };

  useEffect(() => cleanup, []);

  const tickWaveform = () => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    const step = Math.floor(data.length / BAR_COUNT) || 1;
    setBars(
      Array.from({ length: BAR_COUNT }, (_, i) => {
        const v = data[i * step] ?? 0;
        return Math.max(0.15, v / 255);
      }),
    );
    rafRef.current = requestAnimationFrame(tickWaveform);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      audioCtxRef.current = audioCtx;
      analyserRef.current = analyser;

      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const recorded = new File([blob], "voice-note.webm", { type: blob.type });
        const error = validateMediaFile("audio", recorded);
        if (error) {
          onError(error);
        } else {
          onFileChange(recorded);
        }
        cleanup();
      };

      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
      setElapsed(0);
      tickWaveform();

      timerRef.current = setInterval(() => {
        setElapsed((prev) => {
          if (prev + 1 >= MAX_SECONDS) {
            recorderRef.current?.stop();
            setRecording(false);
            return MAX_SECONDS;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      onError("Couldn't access your microphone");
    }
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    setRecording(false);
  };

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (file && !recording) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/15 bg-white/4 px-4 py-8">
        <audio controls src={previewUrl!} className="w-full" />
        <button
          type="button"
          onClick={() => onFileChange(null)}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="size-3.5" />
          Re-record
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/15 bg-white/4 px-4 py-6">
      <button
        type="button"
        onClick={recording ? stopRecording : startRecording}
        className="relative flex size-19 items-center justify-center rounded-full bg-linear-to-r from-violet-500 via-fuchsia-500 to-amber-400"
        style={recording ? { animation: "whispr-pulse-ring 1.8s ease-out infinite" } : undefined}
      >
        {recording ? (
          <Square className="size-5 fill-white text-white" />
        ) : (
          <Mic className="size-7 text-white" />
        )}
      </button>

      {recording && (
        <div className="flex h-8.5 items-end gap-0.75">
          {bars.map((h, i) => (
            <div
              key={i}
              className="w-0.75 rounded-full bg-fuchsia-400"
              style={{ height: `${h * 100}%` }}
            />
          ))}
        </div>
      )}

      <span className="font-mono text-sm font-semibold">
        {formatTime(elapsed)}{" "}
        <span className="text-muted-foreground">/ {formatTime(MAX_SECONDS)} max</span>
      </span>
      <span className="text-xs text-muted-foreground">
        {recording ? "Tap the mic again to stop" : "Tap the mic to start recording"}
      </span>
    </div>
  );
}
