import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NotificationBell from "../NotificationBell";
import * as useAxiosSecureModule from "@/hooks/useAxiosSecure";

vi.mock("@/hooks/useAxiosSecure", () => ({
  default: vi.fn(),
}));

describe("NotificationBell Component", () => {
  let queryClient;
  const mockAxios = {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.mocked(useAxiosSecureModule.default).mockReturnValue(mockAxios);
  });

  const renderWithClient = (ui) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
    );
  };

  it("renders notification bell button with unread count badge", async () => {
    mockAxios.get.mockImplementation((url) => {
      if (url === "/notifications/counts") {
        return Promise.resolve({ data: { data: { total_unread: 5 } } });
      }
      if (url === "/notifications") {
        return Promise.resolve({
          data: {
            data: {
              notifications: [],
              pagination: { current_page: 1, last_page: 1 },
            },
          },
        });
      }
      return Promise.resolve({ data: {} });
    });

    renderWithClient(<NotificationBell />);

    const badge = await screen.findByText("5");
    expect(badge).toBeInTheDocument();
  });

  it("opens dropdown panel when bell is clicked", async () => {
    const user = userEvent.setup();

    mockAxios.get.mockImplementation((url) => {
      if (url.includes("counts")) {
        return Promise.resolve({ data: { data: { total_unread: 1 } } });
      }
      return Promise.resolve({
        data: {
          data: {
            notifications: [
              {
                id: "notif-1",
                type: "announcement",
                is_read: false,
                created_at: new Date().toISOString(),
                data: {
                  title: "Camp Schedule Published",
                  message: "The schedule for Chicago Camp has been released.",
                },
              },
            ],
            pagination: { current_page: 1, last_page: 1 },
          },
        },
      });
    });

    renderWithClient(<NotificationBell />);

    const bellBtn = screen.getByRole("button", { name: /notifications/i });
    await user.click(bellBtn);

    expect(await screen.findByText("Camp Schedule Published")).toBeInTheDocument();
    expect(
      screen.getByText("The schedule for Chicago Camp has been released.")
    ).toBeInTheDocument();
  });

  it("shows empty state message when there are no notifications", async () => {
    const user = userEvent.setup();

    mockAxios.get.mockImplementation((url) => {
      if (url.includes("counts")) {
        return Promise.resolve({ data: { data: { total_unread: 0 } } });
      }
      return Promise.resolve({
        data: {
          data: {
            notifications: [],
            pagination: { current_page: 1, last_page: 1 },
          },
        },
      });
    });

    renderWithClient(<NotificationBell />);

    const bellBtn = screen.getByRole("button", { name: /notifications/i });
    await user.click(bellBtn);

    expect((await screen.findAllByText("You're all caught up")).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("New notifications will appear here.")).toBeInTheDocument();
  });
});
