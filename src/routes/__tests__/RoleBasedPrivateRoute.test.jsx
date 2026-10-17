import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import RoleBasedPrivateRoute from "../RoleBasedPrivateRoute";
import * as useAuthModule from "@/hooks/useAuth";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/components/common/ScreenLoading", () => ({
  default: () => <div data-testid="screen-loading">Screen Loading</div>,
}));

describe("RoleBasedPrivateRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders ScreenLoading when auth state is loading", () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      isLoading: true,
      accessToken: null,
      userData: null,
    });

    render(
      <MemoryRouter>
        <RoleBasedPrivateRoute allowedRoles={["director"]}>
          <div>Protected Content</div>
        </RoleBasedPrivateRoute>
      </MemoryRouter>
    );

    expect(screen.getByTestId("screen-loading")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("redirects to '/' when user has no access token", () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      isLoading: false,
      accessToken: null,
      userData: null,
    });

    render(
      <MemoryRouter initialEntries={["/director-dashboard"]}>
        <Routes>
          <Route path="/" element={<div>Home Login Page</div>} />
          <Route
            path="/director-dashboard"
            element={
              <RoleBasedPrivateRoute allowedRoles={["director"]}>
                <div>Director Protected Content</div>
              </RoleBasedPrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Home Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Director Protected Content")).not.toBeInTheDocument();
  });

  it("renders ScreenLoading when access token exists but userData is not loaded yet", () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      isLoading: false,
      accessToken: "valid-token",
      userData: null,
    });

    render(
      <MemoryRouter>
        <RoleBasedPrivateRoute allowedRoles={["director"]}>
          <div>Protected Content</div>
        </RoleBasedPrivateRoute>
      </MemoryRouter>
    );

    expect(screen.getByTestId("screen-loading")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("redirects unauthorized director to /director-dashboard when trying to access referee route", () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      isLoading: false,
      accessToken: "valid-token",
      userData: { role: "director" },
    });

    render(
      <MemoryRouter initialEntries={["/referee-dashboard"]}>
        <Routes>
          <Route path="/director-dashboard" element={<div>Director Portal</div>} />
          <Route
            path="/referee-dashboard"
            element={
              <RoleBasedPrivateRoute allowedRoles={["referee"]}>
                <div>Referee Protected Content</div>
              </RoleBasedPrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Director Portal")).toBeInTheDocument();
    expect(screen.queryByText("Referee Protected Content")).not.toBeInTheDocument();
  });

  it("redirects unauthorized referee to /referee-dashboard when trying to access evaluator route", () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      isLoading: false,
      accessToken: "valid-token",
      userData: { role: "referee" },
    });

    render(
      <MemoryRouter initialEntries={["/evaluator-dashboard"]}>
        <Routes>
          <Route path="/referee-dashboard" element={<div>Referee Portal</div>} />
          <Route
            path="/evaluator-dashboard"
            element={
              <RoleBasedPrivateRoute allowedRoles={["evaluator"]}>
                <div>Evaluator Content</div>
              </RoleBasedPrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Referee Portal")).toBeInTheDocument();
  });

  it("redirects unauthorized evaluator to /evaluator-dashboard when trying to access director route", () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      isLoading: false,
      accessToken: "valid-token",
      userData: { role: "evaluator" },
    });

    render(
      <MemoryRouter initialEntries={["/director-dashboard"]}>
        <Routes>
          <Route path="/evaluator-dashboard" element={<div>Evaluator Portal</div>} />
          <Route
            path="/director-dashboard"
            element={
              <RoleBasedPrivateRoute allowedRoles={["director"]}>
                <div>Director Content</div>
              </RoleBasedPrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Evaluator Portal")).toBeInTheDocument();
  });

  it("redirects unknown role to '/' when unauthorized", () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      isLoading: false,
      accessToken: "valid-token",
      userData: { role: "guest" },
    });

    render(
      <MemoryRouter initialEntries={["/director-dashboard"]}>
        <Routes>
          <Route path="/" element={<div>Root Fallback Page</div>} />
          <Route
            path="/director-dashboard"
            element={
              <RoleBasedPrivateRoute allowedRoles={["director"]}>
                <div>Director Content</div>
              </RoleBasedPrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Root Fallback Page")).toBeInTheDocument();
  });

  it("renders protected children when user role matches allowedRoles", () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      isLoading: false,
      accessToken: "valid-token",
      userData: { role: "director" },
    });

    render(
      <MemoryRouter>
        <RoleBasedPrivateRoute allowedRoles={["director", "evaluator"]}>
          <div data-testid="director-child">Welcome Director!</div>
        </RoleBasedPrivateRoute>
      </MemoryRouter>
    );

    expect(screen.getByTestId("director-child")).toBeInTheDocument();
    expect(screen.getByText("Welcome Director!")).toBeInTheDocument();
  });
});
