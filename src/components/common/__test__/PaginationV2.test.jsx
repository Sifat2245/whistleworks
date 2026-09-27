import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import PaginationV2 from "../PaginationV2";

describe("PaginationV2 Component", () => {
  it("renders antd pagination with current page and items", () => {
    render(
      <PaginationV2
        currentPage={1}
        perPage={10}
        totalItem={50}
        handlePageClick={vi.fn()}
      />
    );

    // Should render page numbers 1 to 5
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("calls handlePageClick when a page number is clicked", async () => {
    const handlePageClick = vi.fn();
    const user = userEvent.setup();

    render(
      <PaginationV2
        currentPage={1}
        perPage={10}
        totalItem={50}
        handlePageClick={handlePageClick}
      />
    );

    const page2 = screen.getByText("2");
    await user.click(page2);

    expect(handlePageClick).toHaveBeenCalledWith(2, 10);
  });

  it("applies variant classes to wrapper container", () => {
    const { container } = render(
      <PaginationV2
        currentPage={1}
        perPage={10}
        totalItem={20}
        variant="custom-pagination-class"
        handlePageClick={vi.fn()}
      />
    );

    expect(container.firstChild).toHaveClass("custom-pagination-class");
  });
});
