import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import OverviewCards from "../OverviewCards";

vi.mock("../../../hooks/useInsights", () => ({
  useOverview: vi.fn(),
}));

import { useOverview } from "../../../hooks/useInsights";

describe("OverviewCards", () => {
  it("shows loading state while fetching", () => {
    useOverview.mockReturnValue({ data: null, isLoading: true });
    render(<OverviewCards />);
    expect(screen.getByText("Loading overview…")).toBeInTheDocument();
  });

  it("renders all four stat cards with correct values", () => {
    useOverview.mockReturnValue({
      isLoading: false,
      data: {
        total_employees: 10000,
        avg_salary: 102000,
        max_salary: 180000,
        min_salary: 45000,
      },
    });
    render(<OverviewCards />);

    expect(screen.getByText("10,000")).toBeInTheDocument();
    expect(screen.getByText("$102,000")).toBeInTheDocument();
    expect(screen.getByText("$180,000")).toBeInTheDocument();
    expect(screen.getByText("$45,000")).toBeInTheDocument();
  });

  it("renders section title", () => {
    useOverview.mockReturnValue({
      isLoading: false,
      data: { total_employees: 5, avg_salary: 70000, max_salary: 90000, min_salary: 50000 },
    });
    render(<OverviewCards />);
    expect(screen.getByText("Global Overview")).toBeInTheDocument();
  });

  it("renders nothing when data is null and not loading", () => {
    useOverview.mockReturnValue({ data: null, isLoading: false });
    const { container } = render(<OverviewCards />);
    expect(container).toBeEmptyDOMElement();
  });
});
