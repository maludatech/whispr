"use client";

import { useEffect, useRef } from "react";

export function useObjectUrlRef<T extends HTMLImageElement | HTMLVideoElement | HTMLAudioElement>(
  file: File | null,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !file) return;

    const url = URL.createObjectURL(file);
    el.src = url;
    if ("load" in el) el.load();

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  return ref;
}
