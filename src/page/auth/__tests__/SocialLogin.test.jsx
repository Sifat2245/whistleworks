import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import SocialLogin from "../SocialLogin";

describe("SocialLogin Component", () => {
  it("renders Continue with Google button with google icon", () => {
    render(<SocialLogin onGoogleLogin={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: /continue with google/i })
    ).toBeInTheDocument();
  });

  it("triggers onGoogleLogin callback when clicked", async () => {
    const handleGoogleLogin = vi.fn();
    const user = userEvent.setup();

    render(<SocialLogin onGoogleLogin={handleGoogleLogin} />);

    const googleBtn = screen.getByRole("button", {
      name: /continue with google/i,
    });
    await user.click(googleBtn);

    expect(handleGoogleLogin).toHaveBeenCalledTimes(1);
  });
});
