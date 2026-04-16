import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">
      <span className="text-lg font-semibold text-gray-800 mr-6">
        Salary Manager
      </span>
      <NavLink to="/employees" className={linkClass}>
        Employees
      </NavLink>
      <NavLink to="/insights" className={linkClass}>
        Insights
      </NavLink>
    </nav>
  );
}
