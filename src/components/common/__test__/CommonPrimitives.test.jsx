import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CommonTitle from "../CommonTitle";
import CommonText from "../CommonText";
import ErrorText from "../ErrorText";
import Logo from "../Logo";
import CommonContactInfo from "../CommonContactInfo";

vi.mock("../Icon", () => ({
  default: ({ src, className }) => (
    <span data-testid="mock-icon" data-src={src} className={className} />
  ),
}));

describe("Common Primitive UI Components", () => {
  describe("CommonTitle", () => {
    it("renders title text and applies custom class", () => {
      render(<CommonTitle text="Welcome to WhistleWorks" className="text-primary" />);
      const el = screen.getByRole("heading", { level: 3 });
      expect(el).toHaveTextContent("Welcome to WhistleWorks");
      expect(el).toHaveClass("text-primary");
    });
  });

  describe("CommonText", () => {
    it("renders paragraph / text string", () => {
      render(<CommonText text="Officiating made simple" className="text-gray-500" />);
      const el = screen.getByRole("heading", { level: 3 });
      expect(el).toHaveTextContent("Officiating made simple");
      expect(el).toHaveClass("text-gray-500");
    });
  });

  describe("ErrorText", () => {
    it("renders error message in red text", () => {
      render(<ErrorText error="Email is required" className="font-semibold" />);
      const el = screen.getByText("Email is required");
      expect(el).toBeInTheDocument();
      expect(el).toHaveClass("text-red-500", "font-semibold");
    });
  });

  describe("Logo", () => {
    it("renders brand logo image", () => {
      const { container } = render(<Logo className="size-10" />);
      const img = container.querySelector("img");
      expect(img).toBeInTheDocument();
      expect(img).toHaveClass("size-10");
    });
  });

  describe("CommonContactInfo", () => {
    it("renders label and contact info text", () => {
      render(
        <CommonContactInfo
          icon="/icons/mail.svg"
          label="Email Address"
          info="support@whistleworks.com"
        />
      );
      expect(screen.getByText("Email Address")).toBeInTheDocument();
      expect(screen.getByText("support@whistleworks.com")).toBeInTheDocument();
    });
  });
});
