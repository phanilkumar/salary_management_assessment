import OverviewCards from "../components/insights/OverviewCards";
import CountryInsights from "../components/insights/CountryInsights";
import JobTitleInsight from "../components/insights/JobTitleInsight";
import SalaryBandChart from "../components/insights/SalaryBandChart";
import TopJobTitlesTable from "../components/insights/TopJobTitlesTable";

export default function InsightsPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Salary Insights</h1>
        <p className="text-sm text-gray-500">Analytics and trends across your organisation</p>
      </div>

      <OverviewCards />

      <hr className="border-gray-200" />

      <CountryInsights />

      <hr className="border-gray-200" />

      <JobTitleInsight />

      <hr className="border-gray-200" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SalaryBandChart />
        <TopJobTitlesTable />
      </div>
    </div>
  );
}
