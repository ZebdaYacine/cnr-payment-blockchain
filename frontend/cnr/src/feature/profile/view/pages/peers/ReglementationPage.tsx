import React from "react";
import { Link, useParams } from "react-router-dom"; // ✅ Updated to react-router-dom
import { useTheme } from "../../../../../core/state/ThemeContext";

const ReglementationPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { codeReglementation } = useParams();

  const REGLEMENTATIONS = [
    {
      code: "COM-001",
      description: (
        <>
          <h1 className="text-xl font-bold mb-2">Règlementation COM-001</h1>
          <p className="mb-2">
            ⚠️ Il est strictement interdit de communiquer avec un utilisateur
            qui <strong>ne participe plus à la même phase</strong> que vous ou
            si vous n'appartenez pas à l'étape actuelle.
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>La confidentialité des données échangées</li>
            <li>La cohérence des processus en cours</li>
            <li>Le respect des attributions de chaque phase</li>
          </ul>
          <p>
            🔐 Cette règle permet de préserver l'intégrité du système de
            collaboration.
          </p>
        </>
      ),
    },
    {
      code: "COM-002",
      description: (
        <>
          <h1 className="text-xl font-bold mb-2">Règlementation COM-002</h1>
          <ol className="list-decimal list-inside mb-4">
            <li>Les emails doivent utiliser un langage professionnel.</li>
            <li>Aucune pièce jointe non chiffrée ne doit être envoyée.</li>
            <li>
              Les canaux de messagerie sont à usage professionnel uniquement.
            </li>
          </ol>
        </>
      ),
    },
    {
      code: "COM-003",
      description: (
        <>
          <h1 className="text-xl font-bold mb-2">Règlementation COM-003</h1>
          <p className="mb-2">
            🔐 Votre clé privée <strong>n'est pas valide</strong> ou{" "}
            <strong>n'est pas encore enregistrée</strong>.
          </p>
          <p className="mb-2">Vous devez :</p>
          <ul className="list-disc list-inside mb-4">
            <li>
              Fournir une <strong>signature électronique valide</strong>
            </li>
            <li>
              <Link
                to="/home/PK-manager/get-public-key"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Recharger votre clé privée
              </Link>{" "}
              dans votre espace utilisateur
            </li>
          </ul>
          <hr className="my-4" />
          <p>
            Cela garantit l'authenticité et la sécurité des actions effectuées
            dans le système. Sans cela, certaines fonctionnalités (comme le
            téléchargement sécurisé) vous seront inaccessibles.
          </p>
        </>
      ),
    },
  ];

  const reglement = REGLEMENTATIONS.find((r) => r.code === codeReglementation);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center transition-colors duration-300">
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
        <div
          className={`w-full text-left text-sm rounded-xl p-4 max-w-2xl overflow-x-auto border shadow-sm space-y-2 ${
            isDarkMode
              ? "bg-gray-800 text-gray-200 border-gray-700"
              : "bg-gray-100 text-gray-900"
          }`}
        >
          {reglement.description}
        </div>
      )}
    </div>
  );
};

export default ReglementationPage;
