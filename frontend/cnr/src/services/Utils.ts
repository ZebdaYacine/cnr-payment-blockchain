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
