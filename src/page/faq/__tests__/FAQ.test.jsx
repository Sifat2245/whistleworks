import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import FAQ from "../FAQ";

describe("FAQ Page Component", () => {
  const renderFAQ = () =>
    render(
      <MemoryRouter>
        <FAQ />
      </MemoryRouter>,
    );

  it("renders page title, subtitle, search input, and category filter chips", () => {
    renderFAQ();

    expect(
      screen.getByRole("heading", { name: "Frequently Asked Questions" }),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Search questions, topics, or keywords/i),
    ).toBeInTheDocument();
    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getAllByText("General").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Account & Registration").length).toBeGreaterThanOrEqual(1);
  });

  it("toggles an accordion question to reveal and hide the answer", async () => {
    const user = userEvent.setup();
    renderFAQ();

    const questionBtn = screen.getByText("What is WhistleWorks?").closest("button");

    // Initially the answer is hidden
    expect(
      screen.queryByText(/WhistleWorks is a centralized platform designed to connect sports officials/i),
    ).not.toBeInTheDocument();

    // Click to open
    await user.click(questionBtn);
    expect(
      screen.getByText(/WhistleWorks is a centralized platform designed to connect sports officials/i),
    ).toBeInTheDocument();

    // Click again to close
    await user.click(questionBtn);
    expect(
      screen.queryByText(/WhistleWorks is a centralized platform designed to connect sports officials/i),
    ).not.toBeInTheDocument();
  });

  it("filters questions by category when clicking a category chip", async () => {
    const user = userEvent.setup();
    renderFAQ();

    // Switch to 'Payments' (the first element is the chip button)
    const paymentChip = screen.getAllByText("Payments")[0].closest("button");
    await user.click(paymentChip);

    // Questions in this category should exist
    expect(screen.getByText("What payment methods are accepted?")).toBeInTheDocument();
    expect(screen.getByText("Is my payment secure?")).toBeInTheDocument();

    // General questions should be hidden
    expect(screen.queryByText(/What is WhistleWorks\?/i)).not.toBeInTheDocument();
  });

  it("filters questions via search input", async () => {
    const user = userEvent.setup();
    renderFAQ();

    const searchInput = screen.getByPlaceholderText(/Search questions, topics, or keywords/i);
    await user.type(searchInput, "Stripe");

    expect(
      screen.getByText("Is my payment secure?"),
    ).toBeInTheDocument();
    expect(screen.queryByText(/What is WhistleWorks\?/i)).not.toBeInTheDocument();
  });

  it("shows empty state when search has no matches and allows resetting", async () => {
    const user = userEvent.setup();
    renderFAQ();

    const searchInput = screen.getByPlaceholderText(/Search questions, topics, or keywords/i);
    await user.type(searchInput, "xyznonexistentquestion123");

    expect(screen.getByText("No Matching Questions Found")).toBeInTheDocument();

    const resetBtn = screen.getByRole("button", { name: "Reset Search & Filters" });
    await user.click(resetBtn);

    expect(screen.getByText(/What is WhistleWorks\?/i)).toBeInTheDocument();
    expect(searchInput).toHaveValue("");
  });

  it("clears search query using the clear filter button", async () => {
    const user = userEvent.setup();
    renderFAQ();

    const searchInput = screen.getByPlaceholderText(/Search questions, topics, or keywords/i);
    await user.type(searchInput, "account");

    const clearBtn = screen.getByRole("button", { name: "Clear Filter" });
    await user.click(clearBtn);

    expect(searchInput).toHaveValue("");
  });

  it("renders bullet and ordered lists inside expanded answers", async () => {
    const user = userEvent.setup();
    renderFAQ();

    // Question with bullet list: "Who can use WhistleWorks?"
    const bulletQuestion = screen.getByText("Who can use WhistleWorks?").closest("button");
    await user.click(bulletQuestion);

    expect(
      screen.getByText(/Sports officials looking to improve their skills/i),
    ).toBeInTheDocument();

    // Question with ordered list: "How do I register for a camp?"
    const orderedQuestion = screen.getByText("How do I register for a camp?").closest("button");
    await user.click(orderedQuestion);

    expect(screen.getByText("Log into your WhistleWorks account")).toBeInTheDocument();
    expect(screen.getByText("Browse available camps")).toBeInTheDocument();
  });

  it("renders contact support email link", () => {
    renderFAQ();

    expect(screen.getByText("Still Have Questions?")).toBeInTheDocument();
    const mailLink = screen.getByRole("link", { name: /Email Support/i });
    expect(mailLink).toHaveAttribute("href", "mailto:drewbontrager@gmail.com");
  });
});
