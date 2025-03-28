import React from "react";
import { useParams } from "react-router";

const ReglementationPage: React.FC = () => {
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

  const { codeReglementation } = useParams();
  const reglement = REGLEMENTATIONS.find((r) => r.code === codeReglementation);
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="text-6xl mb-4">📜</div>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-700 dark:text-white mb-2">
        Règlementations de Communication
      </h1>

      <p className="text-gray-500 dark:text-gray-300 mb-6 max-w-xl">
        {reglement
          ? "Veuillez consulter la description de cette règle ci-dessous."
          : "Aucune règlementation correspondante trouvée."}
      </p>

      {reglement && (
        <pre className="w-full bg-gray-100 dark:bg-slate-800 text-left text-sm rounded-xl p-4 w-full max-w-2xl overflow-x-auto text-gray-800 dark:text-gray-100 shadow-inner">
          <code>{reglement.description}</code>
        </pre>
      )}
    </div>
  );
};

export default ReglementationPage;
