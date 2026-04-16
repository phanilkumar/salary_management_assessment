import { useState, useCallback } from "react";
import {
  useEmployees,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
} from "../hooks/useEmployees";
import EmployeeTable from "../components/employees/EmployeeTable";
import EmployeeForm from "../components/employees/EmployeeForm";
import EmployeeDeleteDialog from "../components/employees/EmployeeDeleteDialog";
import Modal from "../components/ui/Modal";
import Pagination from "../components/ui/Pagination";

const COUNTRIES = [
  "Australia", "Brazil", "Canada", "France", "Germany",
  "India", "Japan", "Singapore", "UK", "USA",
];
const DEPARTMENTS = [
  "Design", "Engineering", "Finance", "HR",
  "Marketing", "Operations", "Product", "Sales",
];

export default function EmployeesPage() {
  const [page, setPage]               = useState(1);
  const [search, setSearch]           = useState("");
  const [country, setCountry]         = useState("");
  const [department, setDepartment]   = useState("");
  const [sortBy, setSortBy]           = useState("full_name");
  const [sortDir, setSortDir]         = useState("asc");

  const [formModal, setFormModal]     = useState({ open: false, employee: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, employee: null });

  const queryParams = {
    page, per_page: 20, search: search || undefined,
    country: country || undefined,
    department: department || undefined,
    sort_by: sortBy, sort_dir: sortDir,
  };

  const { data, isLoading, isError } = useEmployees(queryParams);
  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();
  const deleteMutation = useDeleteEmployee();

  const handleSort = useCallback((col) => {
    if (sortBy === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortDir("asc");
    }
    setPage(1);
  }, [sortBy]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const openAdd  = () => setFormModal({ open: true, employee: null });
  const openEdit = (emp) => setFormModal({ open: true, employee: emp });
  const closeForm = () => setFormModal({ open: false, employee: null });

  const openDelete  = (emp) => setDeleteModal({ open: true, employee: emp });
  const closeDelete = () => setDeleteModal({ open: false, employee: null });

  const handleFormSubmit = async (payload) => {
    if (formModal.employee) {
      await updateMutation.mutateAsync(payload);
    } else {
      await createMutation.mutateAsync(payload);
    }
    closeForm();
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(deleteModal.employee.id);
    closeDelete();
  };

  const isMutating =
    createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          {data?.meta && (
            <p className="text-sm text-gray-500 mt-0.5">
              {data.meta.total_count.toLocaleString()} total employees
            </p>
          )}
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          + Add Employee
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name…"
          value={search}
          onChange={handleSearch}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={country}
          onChange={(e) => { setCountry(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Countries</option>
          {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={department}
          onChange={(e) => { setDepartment(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Departments</option>
          {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        {(search || country || department) && (
          <button
            onClick={() => { setSearch(""); setCountry(""); setDepartment(""); setPage(1); }}
            className="text-sm text-blue-600 hover:underline px-1"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            Loading employees…
          </div>
        ) : isError ? (
          <div className="text-center py-16 text-red-500 text-sm">
            Failed to load employees. Is the Rails server running?
          </div>
        ) : (
          <>
            <EmployeeTable
              employees={data?.employees ?? []}
              sortBy={sortBy}
              sortDir={sortDir}
              onSort={handleSort}
              onEdit={openEdit}
              onDelete={openDelete}
            />
            <Pagination meta={data?.meta} onPageChange={setPage} />
          </>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={formModal.open}
        onClose={closeForm}
        title={formModal.employee ? "Edit Employee" : "Add Employee"}
      >
        <EmployeeForm
          employee={formModal.employee}
          onSubmit={handleFormSubmit}
          onCancel={closeForm}
          isLoading={isMutating}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={closeDelete}
        title="Delete Employee"
      >
        <EmployeeDeleteDialog
          employee={deleteModal.employee}
          onConfirm={handleDelete}
          onCancel={closeDelete}
          isLoading={deleteMutation.isPending}
        />
      </Modal>
    </div>
  );
}
