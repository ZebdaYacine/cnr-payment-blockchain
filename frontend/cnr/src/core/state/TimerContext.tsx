import React, { createContext, useContext, useEffect, useState } from "react";

interface TimerContextType {
  timeLeft: number;
  startTimer: () => void;
  resetTimer: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const stored = localStorage.getItem("otp_timer");
    return stored ? parseInt(stored, 10) : 60;
  });

  useEffect(() => {
    localStorage.setItem("otp_timer", timeLeft.toString());
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const startTimer = () => {
    setTimeLeft(60);
  };

  const resetTimer = () => {
    setTimeLeft(0);
  };

  return (
    <TimerContext.Provider value={{ timeLeft, startTimer, resetTimer }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
};
