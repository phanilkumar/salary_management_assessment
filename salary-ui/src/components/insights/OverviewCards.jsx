import { useState } from "react";
import { useOverview } from "../../hooks/useInsights";
import StatCard from "../ui/StatCard";
import SectionHeader from "../ui/SectionHeader";

const COUNTRIES = [
  "Australia", "Brazil", "Canada", "France", "Germany",
  "India", "Japan", "Singapore", "UK", "USA",
];

const fmt = (n, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);

export default function OverviewCards() {
  const [country, setCountry] = useState(null);
  const { data, isLoading } = useOverview(country);
  const currency = data?.currency ?? null;

  if (isLoading) return <p className="text-sm text-gray-400">Loading overview…</p>;
  if (!data) return null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <SectionHeader title="Global Overview" subtitle="Salary statistics across all employees" />
        <select
          value={country ?? ""}
          onChange={(e) => setCountry(e.target.value || null)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Countries</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Employees"
          value={data.total_employees.toLocaleString()}
          color="blue"
        />
        <StatCard
          label="Average Salary"
          value={currency ? fmt(data.avg_salary, currency) : "—"}
          color="green"
        />
        <StatCard
          label="Highest Salary"
          value={currency ? fmt(data.max_salary, currency) : "—"}
          color="purple"
        />
        <StatCard
          label="Lowest Salary"
          value={currency ? fmt(data.min_salary, currency) : "—"}
          color="orange"
        />
      </div>
      {!country && (
        <p className="text-xs text-gray-400 mt-2">
          Select a country to view salary statistics in local currency.
        </p>
      )}
    </div>
  );
}
