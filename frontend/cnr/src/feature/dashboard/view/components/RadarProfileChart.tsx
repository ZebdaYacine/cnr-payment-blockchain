import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type RadarProfileChartProps = {
  data: {
    metric: string;
    value: number;
  }[];
};

export default function RadarProfileChart({ data }: RadarProfileChartProps) {
  if (!data || data.length === 0) return <p>No data available</p>;

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, "auto"]} />
          <Tooltip />
          <Radar
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.8}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
