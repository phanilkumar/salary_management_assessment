import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EmployeeForm from "../EmployeeForm";

const fillRequiredFields = async (user) => {
  await user.type(screen.getByPlaceholderText("Jane Smith"), "John Doe");
  await user.type(screen.getByPlaceholderText("Software Engineer"), "Engineer");
  await user.selectOptions(screen.getAllByRole("combobox")[0], "Engineering"); // department
  await user.selectOptions(screen.getAllByRole("combobox")[1], "India");       // country
  await user.type(screen.getByPlaceholderText("jane.smith@company.com"), "john@example.com");
  await user.type(screen.getByPlaceholderText("75000"), "80000");
  fireEvent.change(screen.getByDisplayValue(""), { target: { value: "2023-01-01" } });
};

describe("EmployeeForm", () => {
  it("renders all form fields", () => {
    render(<EmployeeForm onSubmit={vi.fn()} onCancel={vi.fn()} isLoading={false} />);
    expect(screen.getByPlaceholderText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("jane.smith@company.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("75000")).toBeInTheDocument();
  });

  it("shows 'Add Employee' button when no employee prop is passed", () => {
    render(<EmployeeForm onSubmit={vi.fn()} onCancel={vi.fn()} isLoading={false} />);
    expect(screen.getByRole("button", { name: "Add Employee" })).toBeInTheDocument();
  });

  it("shows 'Save Changes' button in edit mode", () => {
    const employee = {
      id: "1", full_name: "Alice", job_title: "Engineer", country: "India",
      department: "Engineering", employment_type: "full_time",
      email: "alice@example.com", hire_date: "2022-01-01", salary: "80000", currency: "USD",
    };
    render(<EmployeeForm employee={employee} onSubmit={vi.fn()} onCancel={vi.fn()} isLoading={false} />);
    expect(screen.getByRole("button", { name: "Save Changes" })).toBeInTheDocument();
  });

  it("pre-fills fields in edit mode", () => {
    const employee = {
      id: "1", full_name: "Alice Smith", job_title: "Senior Engineer", country: "India",
      department: "Engineering", employment_type: "full_time",
      email: "alice@example.com", hire_date: "2022-01-01", salary: "90000", currency: "USD",
    };
    render(<EmployeeForm employee={employee} onSubmit={vi.fn()} onCancel={vi.fn()} isLoading={false} />);
    expect(screen.getByDisplayValue("Alice Smith")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Senior Engineer")).toBeInTheDocument();
    expect(screen.getByDisplayValue("alice@example.com")).toBeInTheDocument();
  });

  it("calls onCancel when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<EmployeeForm onSubmit={vi.fn()} onCancel={onCancel} isLoading={false} />);
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("calls onSubmit with form data when submitted", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue();
    render(<EmployeeForm onSubmit={onSubmit} onCancel={vi.fn()} isLoading={false} />);

    await fillRequiredFields(user);

    await user.click(screen.getByRole("button", { name: "Add Employee" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());

    const payload = onSubmit.mock.calls[0][0];
    expect(payload.full_name).toBe("John Doe");
    expect(payload.email).toBe("john@example.com");
  });

  it("displays server-side validation errors", async () => {
    const user = userEvent.setup();
    const error = { response: { data: { errors: ["Email has already been taken"] } } };
    const onSubmit = vi.fn().mockRejectedValue(error);
    render(<EmployeeForm onSubmit={onSubmit} onCancel={vi.fn()} isLoading={false} />);

    await fillRequiredFields(user);

    await user.click(screen.getByRole("button", { name: "Add Employee" }));
    await waitFor(() =>
      expect(screen.getByText("Email has already been taken")).toBeInTheDocument()
    );
  });

  it("disables submit button when isLoading is true", () => {
    render(<EmployeeForm onSubmit={vi.fn()} onCancel={vi.fn()} isLoading={true} />);
    expect(screen.getByRole("button", { name: "Saving…" })).toBeDisabled();
  });
});
