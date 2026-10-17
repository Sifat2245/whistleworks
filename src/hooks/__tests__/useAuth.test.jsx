import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AuthContext } from "@/context";
import { useAuth } from "../useAuth";

describe("useAuth hook", () => {
  it("returns auth context values when wrapped with AuthContext.Provider", () => {
    const mockAuthValue = {
      userData: { id: 1, name: "Test User", role: "director" },
      accessToken: "mock-token-xyz",
      handleLogin: () => {},
      handleLogout: () => {},
      isLoading: false,
    };

    const wrapper = ({ children }) => (
      <AuthContext.Provider value={mockAuthValue}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.userData).toEqual(mockAuthValue.userData);
    expect(result.current.accessToken).toBe("mock-token-xyz");
    expect(result.current.isLoading).toBe(false);
  });

  it("returns undefined when used outside of AuthContext.Provider", () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current).toBeUndefined();
  });
});
