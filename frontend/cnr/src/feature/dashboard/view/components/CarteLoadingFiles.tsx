import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type InstitutionDetail = {
  nom: string;
  fichiers: number;
  versions: number;
};

type DataPoint = {
  jour: string;
  mois: string;
  fichiers: number;
  versions: number;
  institution: InstitutionDetail[];
};

interface CarteLoadingFilesProps {
  data: DataPoint[];
  defaultMois?: string;
  defaultInstitution?: string;
}

export default function CarteChargementFichiers({
  data,
  defaultMois = "Janvier",
  defaultInstitution = "Toutes",
}: CarteLoadingFilesProps) {
  const [mois, setMois] = useState(defaultMois);
  const [institution, setInstitution] = useState(defaultInstitution);

  const allInstitutions = useMemo(() => {
    const unique = new Set<string>();
    data.forEach((entry) =>
      entry.institution.forEach((inst) => unique.add(inst.nom))
    );
    return ["Toutes", ...Array.from(unique)];
  }, [data]);

  const chartData = useMemo(() => {
    return data
      .filter((entry) => entry.mois === mois)
      .map((entry) => {
        if (institution === "Toutes") {
          return {
            jour: entry.jour,
            fichiers: entry.fichiers,
            versions: entry.versions,
          };
        }

        const inst = entry.institution.find((i) => i.nom === institution);
        return {
          jour: entry.jour,
          fichiers: inst?.fichiers || 0,
          versions: inst?.versions || 0,
        };
      })
      .sort((a, b) => parseInt(a.jour) - parseInt(b.jour));
  }, [mois, institution, data]);

  return (
    <div className="card bg-base-500 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-bold">Chargement de fichiers</h2>
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              className="select select-bordered select-sm"
              value={mois}
              onChange={(e) => setMois(e.target.value)}
            >
              {["Janvier", "Février", "Mars", "Avril", "Mai"].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <select
              className="select select-bordered select-sm"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
            >
              {allInstitutions.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="jour" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ borderRadius: "0.5rem", fontSize: "14px" }}
                formatter={(value, name) => [
                  `${value}`,
                  name === "fichiers" ? "Fichiers" : "Versions",
                ]}
              />
              <Line
                type="monotone"
                dataKey="fichiers"
                stroke="#0ea5e9"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="versions"
                stroke="#6366f1"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
