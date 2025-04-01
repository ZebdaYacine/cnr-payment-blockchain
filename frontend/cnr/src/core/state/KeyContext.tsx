import React, { createContext, useContext, useState, useEffect } from "react";

interface KeyContextType {
  publicKey: string;
  setPublicKey: (key: string) => void;
  privateKey: string;
  setPrivateKey: (key: string) => void;
  digitalSignature: string;
  setDigitalSignature: (signature: string) => void;
  isDigitalSignatureConfirmed: boolean;
  setIsDigitalSignatureConfirmed: (confirmed: boolean) => void;
}

const KeysContext = createContext<KeyContextType | undefined>(undefined);

export const KeysProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [publicKey, setPublicKeyState] = useState<string>("");
  const [privateKey, setPrivateKeyState] = useState<string>("");
  const [digitalSignature, setDigitalSignatureState] = useState<string>("");
  const [isDigitalSignatureConfirmed, setIsDigitalSignatureConfirmedState] =
    useState<boolean>(false);

  // Load keys and signature from localStorage on mount
  useEffect(() => {
    const storedPublic = localStorage.getItem("publicKey");
    const storedPrivate = localStorage.getItem("privateKey");
    const storedSignature = localStorage.getItem("digitalSignature");
    const storedConfirmed = localStorage.getItem("isDigitalSignatureConfirmed");

    if (storedPublic) setPublicKeyState(storedPublic);
    if (storedPrivate) setPrivateKeyState(storedPrivate);
    if (storedSignature) setDigitalSignatureState(storedSignature);
    if (storedConfirmed)
      setIsDigitalSignatureConfirmedState(storedConfirmed === "true");
  }, []);

  const setPublicKey = (key: string) => {
    setPublicKeyState(key);
    localStorage.setItem("publicKey", key);
  };

  const setPrivateKey = (key: string) => {
    setPrivateKeyState(key);
    localStorage.setItem("privateKey", key);
  };

  const setDigitalSignature = (signature: string) => {
    setDigitalSignatureState(signature);
    localStorage.setItem("digitalSignature", signature);
  };

  const setIsDigitalSignatureConfirmed = (confirmed: boolean) => {
    setIsDigitalSignatureConfirmedState(confirmed);
    localStorage.setItem("isDigitalSignatureConfirmed", confirmed.toString());
  };

  return (
    <KeysContext.Provider
      value={{
        publicKey,
        setPublicKey,
        privateKey,
        setPrivateKey,
        digitalSignature,
        setDigitalSignature,
        isDigitalSignatureConfirmed,
        setIsDigitalSignatureConfirmed,
      }}
    >
      {children}
    </KeysContext.Provider>
  );
};

export const useKeys = () => {
  const context = useContext(KeysContext);
  if (!context) throw new Error("useKeys must be used within a KeysProvider");
  return context;
};
