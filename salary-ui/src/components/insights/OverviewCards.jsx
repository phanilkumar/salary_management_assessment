import { useOverview } from "../../hooks/useInsights";
import StatCard from "../ui/StatCard";
import SectionHeader from "../ui/SectionHeader";

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export default function OverviewCards() {
  const { data, isLoading } = useOverview();

  if (isLoading) return <p className="text-sm text-gray-400">Loading overview…</p>;
  if (!data) return null;

  return (
    <div>
      <SectionHeader title="Global Overview" subtitle="Salary statistics across all employees" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Employees"
          value={data.total_employees.toLocaleString()}
          color="blue"
        />
        <StatCard
          label="Average Salary"
          value={fmt(data.avg_salary)}
          color="green"
        />
        <StatCard
          label="Highest Salary"
          value={fmt(data.max_salary)}
          color="purple"
        />
        <StatCard
          label="Lowest Salary"
          value={fmt(data.min_salary)}
          color="orange"
        />
      </div>
    </div>
  );
}
