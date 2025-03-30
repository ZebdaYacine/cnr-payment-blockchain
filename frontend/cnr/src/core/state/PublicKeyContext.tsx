import React, { createContext, useContext, useState, useEffect } from "react";

interface PublicKeyContextType {
  publicKey: string;
  setPublicKey: (key: string) => void;
  privateKey: string;
  setPrivateKey: (key: string) => void;
}

const KeysContext = createContext<PublicKeyContextType | undefined>(undefined);

export const KeysProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [publicKey, setPublicKeyState] = useState<string>("");
  const [privateKey, setPrivateKeyState] = useState<string>("");

  // Load keys from localStorage on mount
  useEffect(() => {
    const storedPublic = localStorage.getItem("publicKey");
    const storedPrivate = localStorage.getItem("privateKey");

    if (storedPublic) {
      setPublicKeyState(storedPublic);
    }
    if (storedPrivate) {
      setPrivateKeyState(storedPrivate);
    }
  }, []);

  // Setters
  const setPublicKey = (key: string) => {
    setPublicKeyState(key);
    localStorage.setItem("publicKey", key);
  };

  const setPrivateKey = (key: string) => {
    setPrivateKeyState(key);
    localStorage.setItem("privateKey", key);
  };

  return (
    <KeysContext.Provider
      value={{ publicKey, setPublicKey, privateKey, setPrivateKey }}
    >
      {children}
    </KeysContext.Provider>
  );
};

export const useKeys = () => {
  const context = useContext(KeysContext);
  if (!context)
    throw new Error("usePublicKey must be used within PublicKeyProvider");
  return context;
};
