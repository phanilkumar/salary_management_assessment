export default function EmployeeDeleteDialog({ employee, onConfirm, onCancel, isLoading }) {
  if (!employee) return null;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Are you sure you want to delete{" "}
        <span className="font-semibold text-gray-900">{employee.full_name}</span>?
        This action cannot be undone.
      </p>
      <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500 space-y-1">
        <p><span className="font-medium">Title:</span> {employee.job_title}</p>
        <p><span className="font-medium">Department:</span> {employee.department}</p>
        <p><span className="font-medium">Country:</span> {employee.country}</p>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
        >
          {isLoading ? "Deleting…" : "Delete Employee"}
        </button>
      </div>
    </div>
  );
}
