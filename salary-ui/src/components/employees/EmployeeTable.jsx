import Badge from "../ui/Badge";

const formatSalary = (amount, currency) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const SORT_COLUMNS = [
  { key: "full_name", label: "Name" },
  { key: "job_title", label: "Job Title" },
  { key: "country", label: "Country" },
  { key: "department", label: "Department" },
  { key: "employment_type", label: "Type" },
  { key: "salary", label: "Salary" },
  { key: "hire_date", label: "Hire Date" },
];

export default function EmployeeTable({
  employees,
  sortBy,
  sortDir,
  onSort,
  onEdit,
  onDelete,
}) {
  const SortIcon = ({ col }) => {
    if (sortBy !== col) return <span className="text-gray-300 ml-1">⇅</span>;
    return (
      <span className="text-blue-500 ml-1">
        {sortDir === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  if (employees.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-2">📭</p>
        <p className="text-sm">No employees found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {SORT_COLUMNS.map(({ key, label }) => (
              <th
                key={key}
                onClick={() => onSort(key)}
                className="px-4 py-3 font-medium text-gray-600 cursor-pointer hover:text-gray-900 whitespace-nowrap select-none"
              >
                {label}
                <SortIcon col={key} />
              </th>
            ))}
            <th className="px-4 py-3 font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {employees.map((emp) => (
            <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                {emp.full_name}
              </td>
              <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                {emp.job_title}
              </td>
              <td className="px-4 py-3 text-gray-600">{emp.country}</td>
              <td className="px-4 py-3 text-gray-600">{emp.department}</td>
              <td className="px-4 py-3">
                <Badge value={emp.employment_type} />
              </td>
              <td className="px-4 py-3 text-gray-700 font-medium whitespace-nowrap">
                {formatSalary(emp.salary, emp.currency)}
              </td>
              <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                {formatDate(emp.hire_date)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(emp)}
                    className="px-3 py-1 text-xs rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(emp)}
                    className="px-3 py-1 text-xs rounded-md bg-red-50 text-red-600 hover:bg-red-100 font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
