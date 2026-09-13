import { useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

type RawToast = ReturnType<typeof useToast>["toast"];
export type ThrottledToastOptions = Parameters<RawToast>[0] & {
  /** Force the pop-up through the throttle (deaths, legendary moments, etc). */
  important?: boolean;
};

const WINDOW_MS = 6000;
const MAX_MINOR_PER_WINDOW = 2;

/**
 * A quest tick can fire a dozen notifications (devotion, sabotage, wounds,
 * buffs...). This wrapper always lets the big moments through — failures,
 * destructive events and long-duration announcements — but rate-limits the
 * routine chatter so the screen isn't buried in pop-ups.
 */
export const useThrottledToast = (showNotifications: boolean) => {
  const { toast: rawToast } = useToast();
  const recent = useRef<number[]>([]);

  return useCallback(
    ({ important, ...opts }: ThrottledToastOptions) => {
      if (!showNotifications) return;

      const now = Date.now();
      recent.current = recent.current.filter((t) => now - t < WINDOW_MS);

      const isImportant =
        important ??
        (opts.variant === "destructive" || (opts.duration ?? 0) >= 6000);

      if (!isImportant && recent.current.length >= MAX_MINOR_PER_WINDOW) return;

      recent.current.push(now);
      rawToast(opts);
    },
    [rawToast, showNotifications]
  );
};
