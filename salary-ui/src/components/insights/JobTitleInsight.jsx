import { useState } from "react";
import { useByJobTitle } from "../../hooks/useInsights";
import StatCard from "../ui/StatCard";
import SectionHeader from "../ui/SectionHeader";

const COUNTRIES = [
  "Australia", "Brazil", "Canada", "France", "Germany",
  "India", "Japan", "Singapore", "UK", "USA",
];

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export default function JobTitleInsight() {
  const [country, setCountry]   = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [submitted, setSubmitted] = useState({ country: "", jobTitle: "" });

  const { data, isLoading, isError } = useByJobTitle(
    submitted.country,
    submitted.jobTitle
  );

  const handleSearch = (e) => {
    e.preventDefault();
    setSubmitted({ country, jobTitle });
  };

  return (
    <div>
      <SectionHeader
        title="Job Title Salary Lookup"
        subtitle="Find average salary for a specific job title in a country"
      />
      <form onSubmit={handleSearch} className="flex flex-wrap gap-3 mb-6">
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select country…</option>
          {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="e.g. Software Engineer"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 font-medium"
        >
          Search
        </button>
      </form>

      {isLoading && submitted.country && (
        <p className="text-sm text-gray-400">Searching…</p>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
          No results found for <strong>{submitted.jobTitle}</strong> in <strong>{submitted.country}</strong>.
        </div>
      )}

      {data && !isLoading && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Results for <span className="font-semibold">{data.job_title}</span> in{" "}
            <span className="font-semibold">{data.country}</span>
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Headcount"   value={data.headcount.toLocaleString()} color="blue" />
            <StatCard label="Avg Salary"  value={fmt(data.avg_salary)}  color="green" />
            <StatCard label="Max Salary"  value={fmt(data.max_salary)}  color="purple" />
            <StatCard label="Min Salary"  value={fmt(data.min_salary)}  color="orange" />
          </div>
        </div>
      )}
    </div>
  );
}
