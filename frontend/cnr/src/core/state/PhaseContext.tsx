import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { PhaseResponse } from "../../feature/profile/data/dtos/ProfileDtos";

interface PhaseContextType {
  phase: PhaseResponse | undefined;
  SetCurrentPhase: (phase: PhaseResponse) => void;
}

const PhaseContext = createContext<PhaseContextType | undefined>(undefined);

export const PhaseProvider = ({ children }: { children: ReactNode }) => {
  const [phase, setCurrentPhase] = useState<PhaseResponse>();

  useEffect(() => {
    if (phase?.id) {
      localStorage.setItem("current-phase", String(phase.id));
    }
  }, [phase?.id]);

  return (
    <PhaseContext.Provider value={{ phase, SetCurrentPhase: setCurrentPhase }}>
      {children}
    </PhaseContext.Provider>
  );
};

export const usePhaseId = (): PhaseContextType => {
  const context = useContext(PhaseContext);
  if (!context) {
    throw new Error("usePhaseId must be used within a PhaseProvider");
  }
  return context;
};
