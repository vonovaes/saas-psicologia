'use client';

import { useEffect, useRef } from 'react';

interface PreviewStateManagerProps {
  onDataChange: (data: any) => void;
  debounceMs?: number;
}

export function usePreviewStateManager({ onDataChange, debounceMs = 300 }: PreviewStateManagerProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedUpdate = (data: any) => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      onDataChange(data);
    }, debounceMs);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { debouncedUpdate };
}
