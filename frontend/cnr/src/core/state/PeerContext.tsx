import { createContext, useState, ReactNode, useContext } from "react";
import { Child } from "../../feature/profile/data/dtos/ProfileDtos";

interface PeerContextType {
  Peer: Child;
  SetChild: (peer: Child) => void;
}

const PeerContext = createContext<PeerContextType | undefined>(undefined);

export const PeerProvider = ({ children }: { children: ReactNode }) => {
  const [Peer, setPeer] = useState<Child>();

  const SetPeer = (Peer: Child) => {
    setPeer(Peer);
  };

  return (
    <PeerContext.Provider
      value={{
        Peer: Peer!,
        SetChild: SetPeer,
      }}
    >
      {children}
    </PeerContext.Provider>
  );
};

export const usePeer = (): PeerContextType => {
  const context = useContext(PeerContext);
  if (!context) {
    throw new Error("usePeerId must be used within a PeerProvider");
  }
  return context;
};
