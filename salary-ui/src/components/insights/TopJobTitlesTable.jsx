import { useTopJobTitles } from "../../hooks/useInsights";
import SectionHeader from "../ui/SectionHeader";

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export default function TopJobTitlesTable() {
  const { data, isLoading } = useTopJobTitles(10);

  if (isLoading) return <p className="text-sm text-gray-400">Loading top job titles…</p>;
  if (!data?.length) return null;

  return (
    <div>
      <SectionHeader
        title="Top 10 Highest Paying Job Titles"
        subtitle="Ranked by average salary across all countries"
      />
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide w-8">#</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Job Title</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">Avg Salary</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">Employees</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row, i) => (
              <tr key={row.job_title} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-400 font-medium">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{row.job_title}</td>
                <td className="px-4 py-3 text-right font-semibold text-green-700">{fmt(row.avg_salary)}</td>
                <td className="px-4 py-3 text-right text-gray-500">{row.headcount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
