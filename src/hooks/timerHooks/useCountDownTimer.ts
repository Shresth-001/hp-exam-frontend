'use client'
import { useEffect, useState, useRef } from "react";

interface TimerOptions {
  duration: number;
  storageKey: string;
  onExpire?: () => void;
}

export const useCountdownTimer = ({
  duration,
  storageKey,
  onExpire,
}: TimerOptions) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const expiredRef = useRef(false);
  useEffect(() => {
    const savedStartTime = localStorage.getItem(storageKey);
    let startTime: number;

    if (savedStartTime) {
      startTime = parseInt(savedStartTime, 10);
    } else {
      startTime = Date.now();
      localStorage.setItem(storageKey, startTime.toString());
    }

    const updateRemaining = () => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = duration - elapsed;
    //   console.log(elapsed, remaining);
        // console.log(remaining)
      if (remaining <= 0) {
        setTimeLeft(0);
        if (!expiredRef.current) {
          expiredRef.current = true;
          if (onExpire) onExpire();
        }
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        // console.log(remaining)
        setTimeLeft(remaining);
      }
    };

    updateRemaining();
    timerRef.current = setInterval(updateRemaining, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [duration, storageKey, onExpire]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return { timeLeft, formatTime };
};
