import React from "react";
import { useParams } from "react-router";
import { useTheme } from "../../../../../core/state/ThemeContext";

const ReglementationPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { codeReglementation } = useParams();

  const REGLEMENTATIONS = [
    {
      code: "COM-001",
      description: `
# Règlementation COM-001

⚠️ Il est strictement interdit de communiquer avec un utilisateur qui **ne participe plus à la même phase** que vous.

---

Cela garantit :
- La confidentialité des données échangées
- La cohérence des processus en cours
- Le respect des attributions de chaque phase

🔐 Cette règle permet de préserver l'intégrité du système de collaboration.
`,
    },
    {
      code: "COM-002",
      description: `
# Règlementation COM-002

1. Les emails doivent utiliser un langage professionnel.
2. Aucune pièce jointe non chiffrée ne doit être envoyée.
3. Les canaux de messagerie sont à usage professionnel uniquement.`,
    },
  ];
  const reglement = REGLEMENTATIONS.find((r) => r.code === codeReglementation);

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[70vh] px-4 text-center transition-colors duration-300 `}
    >
      <div className="text-6xl mb-4">📜</div>

      <h1 className="text-2xl sm:text-3xl font-bold mb-2">
        Règlementations de Communication
      </h1>

      <p
        className={`font-bold text-lg mb-6 max-w-xl ${
          isDarkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        {reglement
          ? "Veuillez consulter la description de cette règle ci-dessous."
          : "Aucune règlementation correspondante trouvée."}
      </p>

      {reglement && (
        <pre
          className={`w-full text-left text-sm rounded-xl p-4 max-w-2xl overflow-x-auto border shadow-sm ${
            isDarkMode
              ? "bg-gray-800 text-gray-200 border-gray-700"
              : "bg-gray-100 text-gray-900"
          }`}
        >
          <code>{reglement.description}</code>
        </pre>
      )}
    </div>
  );
};

export default ReglementationPage;
