import React, { createContext, useContext, useEffect, useState } from "react";

interface TimerContextType {
  timeLeft: number;
  startTimer: () => void;
  resetTimer: () => void;
  hasStarted: boolean;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    localStorage.setItem("otp_timer", timeLeft.toString());
  }, [timeLeft]);

  useEffect(() => {
    const saved = localStorage.getItem("otp_timer");
    if (saved) {
      setTimeLeft(parseInt(saved));
    }
  }, []);

  const startTimer = () => {
    if (hasStarted) return;

    setHasStarted(true);
    setTimeLeft(60);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetTimer = () => {
    setHasStarted(false);
    setTimeLeft(60);
  };

  return (
    <TimerContext.Provider
      value={{ timeLeft, startTimer, resetTimer, hasStarted }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) throw new Error("useTimer must be used within TimerProvider");
  return context;
};
