import { useFileMetaData } from "../core/state/FileContext";
import { useFoldersMetaData } from "../core/state/FolderContext";
import { useKeys } from "../core/state/KeyContext";
import { useListUsers } from "../core/state/ListOfUsersContext";
import { useTheme } from "../core/state/ThemeContext";

export const GetAgentLabel = (type: string): string => {
  switch (type) {
    case "CAL":
      return "Calculateur";
    case "FINC":
      return "Vérificateur financier";
    case "VAL":
      return "Vérificateur";
    case "IT":
      return "Agent Informatique";
    case "RESP-SFTP":
      return "Responsable SFTP";
    default:
      return `Agent ${type}`;
  }
};

export const HandleDateTime = (dateTime: Date): string => {
  const formattedTime = dateTime.toLocaleString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return formattedTime;
};

export const useResetState = () => {
  const { setFilesList } = useFileMetaData();
  const { setFoldersList } = useFoldersMetaData();
  const { setUsersList } = useListUsers();
  const { toggleLightMode } = useTheme();
  const {
    setDigitalSignature,
    setIsDigitalSignatureConfirmed,
    setPrivateKey,
    setPublicKey,
  } = useKeys();

  return () => {
    setFilesList([]);
    setFoldersList([]);
    setUsersList([]);
    toggleLightMode();
    setDigitalSignature("");
    setIsDigitalSignatureConfirmed(false);
    setPrivateKey("");
    setPublicKey("");
  };
};
