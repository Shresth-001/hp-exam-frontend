"use client";
import { useEffect, useState, useRef } from "react";

interface QuestionTimerOptions {
  questionId: string;
  duration: number;
  onExpire?: () => void;
}

export const useQuestionTimer = ({
  questionId,
  duration,
  onExpire,
}: QuestionTimerOptions) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [expired, setExpired] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setExpired(false);
    const savedElapsed = localStorage.getItem(`question-timer-${questionId}`);
    let elapsed = savedElapsed ? parseInt(savedElapsed, 10) : 0;
    const remaining = duration - elapsed;

    if (remaining <= 0) {
      setTimeLeft(0);
      setExpired(true);
      if (onExpire) onExpire();
      return;
    } else {
      setTimeLeft(remaining);
    }
    const updateRemaining = () => {
      elapsed += 1;
      localStorage.setItem(`question-timer-${questionId}`, elapsed.toString());

      const left = duration - elapsed;
      if (left <= 0) {
        setTimeLeft(0);
        setExpired(true);
        if (onExpire) onExpire();
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current=null;
        }
      } else {
        setTimeLeft(left);
      }
    };

    setTimeLeft(duration - elapsed);
    timerRef.current = setInterval(updateRemaining, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [questionId, duration, onExpire]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return { timeLeft, formatTime, expired };
};
