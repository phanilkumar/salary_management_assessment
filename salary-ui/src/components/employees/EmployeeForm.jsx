import { useState, useEffect } from "react";

const COUNTRIES = [
  "Australia", "Brazil", "Canada", "France", "Germany",
  "India", "Japan", "Singapore", "UK", "USA",
];
const DEPARTMENTS = [
  "Design", "Engineering", "Finance", "HR",
  "Marketing", "Operations", "Product", "Sales",
];
const EMPLOYMENT_TYPES = [
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "contract",  label: "Contract" },
];
const CURRENCIES = ["AUD", "CAD", "EUR", "GBP", "INR", "SGD", "USD"];

const EMPTY_FORM = {
  full_name: "", job_title: "", country: "", department: "",
  employment_type: "full_time", email: "", hire_date: "",
  salary: "", currency: "USD",
};

export default function EmployeeForm({ employee, onSubmit, onCancel, isLoading }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (employee) {
      setForm({
        full_name:       employee.full_name       || "",
        job_title:       employee.job_title       || "",
        country:         employee.country         || "",
        department:      employee.department      || "",
        employment_type: employee.employment_type || "full_time",
        email:           employee.email           || "",
        hire_date:       employee.hire_date       || "",
        salary:          employee.salary          || "",
        currency:        employee.currency        || "USD",
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors([]);
  }, [employee]);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    try {
      await onSubmit(employee ? { id: employee.id, ...form } : form);
    } catch (err) {
      const serverErrors = err?.response?.data?.errors;
      setErrors(serverErrors ?? ["Something went wrong. Please try again."]);
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const labelClass = "block text-xs font-medium text-gray-600 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <ul className="list-disc list-inside space-y-0.5">
            {errors.map((err, i) => (
              <li key={i} className="text-xs text-red-600">{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className={labelClass}>Full Name *</label>
          <input
            className={inputClass}
            value={form.full_name}
            onChange={set("full_name")}
            placeholder="Jane Smith"
            required
          />
        </div>

        <div>
          <label className={labelClass}>Job Title *</label>
          <input
            className={inputClass}
            value={form.job_title}
            onChange={set("job_title")}
            placeholder="Software Engineer"
            required
          />
        </div>

        <div>
          <label className={labelClass}>Department *</label>
          <select className={inputClass} value={form.department} onChange={set("department")} required>
            <option value="">Select department</option>
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>Country *</label>
          <select className={inputClass} value={form.country} onChange={set("country")} required>
            <option value="">Select country</option>
            {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>Employment Type *</label>
          <select className={inputClass} value={form.employment_type} onChange={set("employment_type")} required>
            {EMPLOYMENT_TYPES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <label className={labelClass}>Email *</label>
          <input
            className={inputClass}
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="jane.smith@company.com"
            required
          />
        </div>

        <div>
          <label className={labelClass}>Salary *</label>
          <input
            className={inputClass}
            type="number"
            min="0"
            step="100"
            value={form.salary}
            onChange={set("salary")}
            placeholder="75000"
            required
          />
        </div>

        <div>
          <label className={labelClass}>Currency *</label>
          <select className={inputClass} value={form.currency} onChange={set("currency")} required>
            {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="col-span-2">
          <label className={labelClass}>Hire Date *</label>
          <input
            className={inputClass}
            type="date"
            value={form.hire_date}
            onChange={set("hire_date")}
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {isLoading ? "Saving…" : employee ? "Save Changes" : "Add Employee"}
        </button>
      </div>
    </form>
  );
}
