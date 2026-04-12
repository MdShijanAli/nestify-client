"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  startTransition,
} from "react";

export type UserRole = "customer" | "agent" | "admin";

export type AuthUser = {
  email: string;
  name: string;
  role?: UserRole;
};

type AuthResult = {
  success: boolean;
  error?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => AuthResult;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole,
  ) => AuthResult;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_KEY = "nestify-user";
const REGISTERED_USERS_KEY = "nestify-registered-users";

// Demo storage for users (in a real app, this would be server-side)
const getRegisteredUsers = (): Array<{
  email: string;
  password: string;
  name: string;
  role: UserRole;
}> => {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveRegisteredUsers = (
  users: Array<{
    email: string;
    password: string;
    name: string;
    role: UserRole;
  }>,
) => {
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    startTransition(() => {
      try {
        const raw = localStorage.getItem(AUTH_KEY);
        if (raw) setUser(JSON.parse(raw) as AuthUser);
      } catch {
        /* ignore corrupt storage */
      }
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (user) localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    else localStorage.removeItem(AUTH_KEY);
  }, [user, hydrated]);

  const login = useCallback((email: string, password: string): AuthResult => {
    const users = getRegisteredUsers();
    const foundUser = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (foundUser) {
      setUser({
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
      });
      return { success: true };
    }

    return { success: false, error: "Invalid email or password" };
  }, []);

  const register = useCallback(
    (
      name: string,
      email: string,
      password: string,
      role: UserRole,
    ): AuthResult => {
      const users = getRegisteredUsers();

      if (users.some((u) => u.email === email)) {
        return { success: false, error: "Email already registered" };
      }

      if (password.length < 6) {
        return {
          success: false,
          error: "Password must be at least 6 characters",
        };
      }

      users.push({ email, password, name, role });
      saveRegisteredUsers(users);

      setUser({ email, name, role });
      return { success: true };
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [user, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
