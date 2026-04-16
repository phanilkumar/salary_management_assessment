import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend,
} from "recharts";
import { useByCountry } from "../../hooks/useInsights";
import StatCard from "../ui/StatCard";
import SectionHeader from "../ui/SectionHeader";

const COUNTRY_COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444",
  "#8b5cf6", "#06b6d4", "#f97316", "#84cc16",
  "#ec4899", "#14b8a6",
];

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow p-3 text-xs">
      <p className="font-semibold text-gray-800 mb-1">{label}</p>
      <p style={{ color: payload[0].fill }}>
        Avg Salary: {fmt(payload[0].value)}
      </p>
    </div>
  );
};

const CustomLegend = ({ countries }) => (
  <div className="flex flex-wrap justify-center gap-3 mt-3">
    {countries.map((c, i) => (
      <div key={c.country} className="flex items-center gap-1.5 text-xs text-gray-600">
        <span
          className="w-3 h-3 rounded-sm inline-block"
          style={{ backgroundColor: COUNTRY_COLORS[i % COUNTRY_COLORS.length] }}
        />
        {c.country}
      </div>
    ))}
  </div>
);

export default function CountryInsights() {
  const { data: countries, isLoading } = useByCountry();
  const [selected, setSelected] = useState("");

  if (isLoading) return <p className="text-sm text-gray-400">Loading country data…</p>;
  if (!countries?.length) return null;

  const selectedData = countries.find((c) => c.country === selected);
  const chartData = countries.map((c) => ({ name: c.country, "Avg Salary": c.avg_salary }));

  return (
    <div className="space-y-6">
      <div>
        <SectionHeader
          title="Salary by Country"
          subtitle="Average salary comparison across all countries"
        />
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 4, right: 16, left: 16, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 11 }}
                width={55}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Avg Salary" radius={[4, 4, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COUNTRY_COLORS[i % COUNTRY_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <CustomLegend countries={countries} />
        </div>
      </div>

      <div>
        <SectionHeader
          title="Country Details"
          subtitle="Select a country to see detailed salary statistics"
        />
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a country…</option>
          {countries.map((c) => (
            <option key={c.country} value={c.country}>{c.country}</option>
          ))}
        </select>

        {selectedData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Employees" value={selectedData.headcount.toLocaleString()} color="blue" />
            <StatCard label="Avg Salary" value={fmt(selectedData.avg_salary)} color="green" />
            <StatCard label="Max Salary" value={fmt(selectedData.max_salary)} color="purple" />
            <StatCard label="Min Salary" value={fmt(selectedData.min_salary)} color="orange" />
          </div>
        )}
      </div>
    </div>
  );
}
