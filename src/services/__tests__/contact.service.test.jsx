import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useContactService } from "../contact.service";

const mockAxiosPublic = vi.hoisted(() => ({
  post: vi.fn(),
}));

vi.mock("@/hooks/useAxiosPublic", () => ({ default: () => mockAxiosPublic }));

describe("contact.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("converts plain object data into FormData and posts to /contact-form", () => {
    const { result } = renderHook(() => useContactService());
    const contactData = {
      name: "Ariful",
      email: "rufuzxyz@gmail.com",
      subject: "Inquiry about referee camp",
      message: "Hello, I would like more information.",
      phone: "01526302623",
    };

    result.current.submitContactForm(contactData);

    expect(mockAxiosPublic.post).toHaveBeenCalledTimes(1);
    const [url, payload, config] = mockAxiosPublic.post.mock.calls[0];

    expect(url).toBe("/contact-form");
    expect(payload).toBeInstanceOf(FormData);
    expect(payload.get("name")).toBe("Ariful");
    expect(payload.get("email")).toBe("rufuzxyz@gmail.com");
    expect(payload.get("subject")).toBe("Inquiry about referee camp");
    expect(payload.get("message")).toBe("Hello, I would like more information.");
    expect(payload.get("phone")).toBe("01526302623");
    expect(config).toEqual({
      headers: { "Content-Type": "multipart/form-data" },
    });
  });

  it("submits FormData directly if already an instance of FormData", () => {
    const { result } = renderHook(() => useContactService());
    const existingFormData = new FormData();
    existingFormData.append("name", "Ariful");
    existingFormData.append("email", "rufuzxyz@gmail.com");

    result.current.submitContactForm(existingFormData);

    expect(mockAxiosPublic.post).toHaveBeenCalledWith(
      "/contact-form",
      existingFormData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  });
});
