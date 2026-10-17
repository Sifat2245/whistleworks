import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSubmitContactForm } from "../useContact";
import * as contactServiceModule from "@/services/contact.service";

vi.mock("@/services/contact.service", () => ({
  useContactService: vi.fn(),
}));

describe("useSubmitContactForm hook", () => {
  let queryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("calls submitContactForm service method upon mutation", async () => {
    const mockSubmit = vi.fn().mockResolvedValue({
      data: { status: true, message: "Contact form submitted successfully" },
    });

    vi.mocked(contactServiceModule.useContactService).mockReturnValue({
      submitContactForm: mockSubmit,
    });

    const { result } = renderHook(() => useSubmitContactForm(), { wrapper });

    const contactPayload = {
      name: "Ariful",
      email: "rufuzxyz@gmail.com",
      subject: "Test Subject",
      message: "Testing message payload",
      phone: "01526302623",
    };

    result.current.mutate(contactPayload);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockSubmit).toHaveBeenCalledWith(contactPayload, expect.anything());
  });

  it("handles submission failure", async () => {
    const mockError = new Error("Network error");
    const mockSubmit = vi.fn().mockRejectedValue(mockError);

    vi.mocked(contactServiceModule.useContactService).mockReturnValue({
      submitContactForm: mockSubmit,
    });

    const { result } = renderHook(() => useSubmitContactForm(), { wrapper });

    result.current.mutate({ name: "Error Test" });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBe(mockError);
  });
});
