import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer,
} from "recharts";
import { useSalaryBands } from "../../hooks/useInsights";
import SectionHeader from "../ui/SectionHeader";

const COLORS = ["#6366f1", "#3b82f6", "#10b981", "#f59e0b"];

const COUNTRIES = [
  "Australia", "Brazil", "Canada", "France", "Germany",
  "India", "Japan", "Singapore", "UK", "USA",
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow p-3 text-xs">
      <p className="font-semibold text-gray-800 mb-1">{label}</p>
      <p className="text-gray-600">{payload[0].value.toLocaleString()} employees ({payload[0].payload.percentage}%)</p>
    </div>
  );
};

export default function SalaryBandChart() {
  const [country, setCountry] = useState(null);
  const { data, isLoading } = useSalaryBands(country);

  if (isLoading) return <p className="text-sm text-gray-400">Loading salary bands…</p>;
  if (!data?.length) return null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <SectionHeader
          title="Salary Band Distribution"
          subtitle="Number of employees in each salary range"
        />
        <select
          value={country ?? ""}
          onChange={(e) => setCountry(e.target.value || null)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Countries (USD)</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 4, right: 16, left: 16, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} width={55} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap justify-center gap-4 mt-2">
          {data.map((band, i) => (
            <div key={band.label} className="flex items-center gap-1.5 text-xs text-gray-600">
              <span
                className="w-3 h-3 rounded-sm inline-block"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              {band.label} — {band.percentage}%
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
