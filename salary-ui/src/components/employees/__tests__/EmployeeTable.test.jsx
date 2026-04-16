import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EmployeeTable from "../EmployeeTable";

const mockEmployees = [
  {
    id: "1",
    full_name: "Alice Smith",
    job_title: "Software Engineer",
    country: "India",
    department: "Engineering",
    employment_type: "full_time",
    salary: "90000",
    currency: "USD",
    hire_date: "2022-03-01",
  },
  {
    id: "2",
    full_name: "Bob Jones",
    job_title: "Product Manager",
    country: "USA",
    department: "Product",
    employment_type: "contract",
    salary: "110000",
    currency: "USD",
    hire_date: "2021-06-15",
  },
];

const defaultProps = {
  employees: mockEmployees,
  sortBy: "full_name",
  sortDir: "asc",
  onSort: vi.fn(),
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

describe("EmployeeTable", () => {
  it("renders all employee rows", () => {
    render(<EmployeeTable {...defaultProps} />);
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("Bob Jones")).toBeInTheDocument();
  });

  it("renders job title and country for each employee", () => {
    render(<EmployeeTable {...defaultProps} />);
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("India")).toBeInTheDocument();
    expect(screen.getByText("Product Manager")).toBeInTheDocument();
    expect(screen.getByText("USA")).toBeInTheDocument();
  });

  it("renders formatted salary", () => {
    render(<EmployeeTable {...defaultProps} />);
    expect(screen.getByText("$90,000")).toBeInTheDocument();
    expect(screen.getByText("$110,000")).toBeInTheDocument();
  });

  it("renders employment type badges", () => {
    render(<EmployeeTable {...defaultProps} />);
    expect(screen.getByText("Full Time")).toBeInTheDocument();
    expect(screen.getByText("Contract")).toBeInTheDocument();
  });

  it("calls onEdit with the correct employee when Edit is clicked", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(<EmployeeTable {...defaultProps} onEdit={onEdit} />);
    const editButtons = screen.getAllByRole("button", { name: "Edit" });
    await user.click(editButtons[0]);
    expect(onEdit).toHaveBeenCalledWith(mockEmployees[0]);
  });

  it("calls onDelete with the correct employee when Delete is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<EmployeeTable {...defaultProps} onDelete={onDelete} />);
    const deleteButtons = screen.getAllByRole("button", { name: "Delete" });
    await user.click(deleteButtons[1]);
    expect(onDelete).toHaveBeenCalledWith(mockEmployees[1]);
  });

  it("calls onSort with the column key when a header is clicked", async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    render(<EmployeeTable {...defaultProps} onSort={onSort} />);
    await user.click(screen.getByText(/Salary/));
    expect(onSort).toHaveBeenCalledWith("salary");
  });

  it("shows empty state when no employees are provided", () => {
    render(<EmployeeTable {...defaultProps} employees={[]} />);
    expect(screen.getByText("No employees found")).toBeInTheDocument();
  });
});
