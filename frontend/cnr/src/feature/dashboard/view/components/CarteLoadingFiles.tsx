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

const getDaysInMonth = (month: string): number => {
  const monthIndex = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ].indexOf(month);

  const year = 2025;
  return new Date(year, monthIndex + 1, 0).getDate(); // gets last day of the month
};

export default function CarteChargementFichiers({
  data,
  defaultMois = "Mai",
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
    const daysInMonth = getDaysInMonth(mois);

    // Create base data for all days
    const baseData = Array.from({ length: daysInMonth }, (_, i) => ({
      jour: (i + 1).toString(),
      fichiers: 0,
      versions: 0,
    }));

    // Create a map of actual data
    const filteredData = data
      .filter((entry) => entry.mois === mois)
      .reduce<Record<string, { fichiers: number; versions: number }>>(
        (acc, entry) => {
          const jour = entry.jour;
          if (institution === "Toutes") {
            acc[jour] = {
              fichiers: entry.fichiers,
              versions: entry.versions,
            };
          } else {
            const inst = entry.institution.find((i) => i.nom === institution);
            acc[jour] = {
              fichiers: inst?.fichiers || 0,
              versions: inst?.versions || 0,
            };
          }
          return acc;
        },
        {}
      );

    return baseData.map((d) => ({
      jour: d.jour,
      fichiers: filteredData[d.jour]?.fichiers ?? 0,
      versions: filteredData[d.jour]?.versions ?? 0,
    }));
  }, [mois, institution, data]);

  const yMax = useMemo(() => {
    const maxValue = Math.max(
      ...chartData.map((d) => Math.max(d.fichiers, d.versions))
    );
    return Math.ceil(maxValue / 5) * 5;
  }, [chartData]);

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
              {[
                "Janvier",
                "Février",
                "Mars",
                "Avril",
                "Mai",
                "Juin",
                "Juillet",
                "Août",
                "Septembre",
                "Octobre",
                "Novembre",
                "Décembre",
              ].map((m) => (
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
              <YAxis
                axisLine={false}
                tickLine={false}
                domain={[1, yMax]}
                ticks={Array.from(
                  { length: yMax === 0 ? 5 : yMax / 5 + 1 },
                  (_, i) => i * 5
                )}
              />
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
