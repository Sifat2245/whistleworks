import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import CommonSubmitBtn from "../CommonSubmitBtn";

describe("CommonSubmitBtn Component", () => {
  it("renders button with children text", () => {
    render(<CommonSubmitBtn>Submit Application</CommonSubmitBtn>);
    expect(screen.getByRole("button", { name: /submit application/i })).toBeInTheDocument();
  });

  it("triggers onClick when clicked", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<CommonSubmitBtn onClick={handleClick}>Click Me</CommonSubmitBtn>);
    await user.click(screen.getByRole("button", { name: /click me/i }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders as a Link when link=true with path", () => {
    render(
      <MemoryRouter>
        <CommonSubmitBtn link path="/all-camps">
          Browse Camps
        </CommonSubmitBtn>
      </MemoryRouter>
    );

    const linkEl = screen.getByRole("link", { name: /browse camps/i });
    expect(linkEl).toBeInTheDocument();
    expect(linkEl).toHaveAttribute("href", "/all-camps");
  });

  it("disables button and shows loader when isLoading=true", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <CommonSubmitBtn isLoading onClick={handleClick}>
        Save Changes
      </CommonSubmitBtn>
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("cursor-not-allowed");

    // Children text should be replaced by loader
    expect(screen.queryByText(/save changes/i)).not.toBeInTheDocument();

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("applies variant classes correctly", () => {
    const { rerender } = render(
      <CommonSubmitBtn variant="danger">Delete</CommonSubmitBtn>
    );
    expect(screen.getByRole("button")).toHaveClass("bg-red-600");

    rerender(<CommonSubmitBtn variant="secondary">Cancel</CommonSubmitBtn>);
    expect(screen.getByRole("button")).toHaveClass("text-primary");
  });
});
