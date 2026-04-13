"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";

export type UserRole = "admin" | "agent" | "customer";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  joinDate: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
  ) => { success: boolean; error?: string };
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole,
  ) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

const AUTH_KEY = "estatehub_auth";
const REGISTERED_USERS_KEY = "estatehub_registered_users";

// Dummy users for demo
const dummyUsers: (AuthUser & { password: string })[] = [
  {
    id: "u-admin-1",
    name: "Admin User",
    email: "admin@nestify.com",
    password: "admin123",
    role: "admin",
    phone: "+1 555-0100",
    joinDate: "2025-01-01",
  },
  {
    id: "u-agent-1",
    name: "Sarah Mitchell",
    email: "agent@nestify.com",
    password: "agent123",
    role: "agent",
    phone: "+1 555-0200",
    joinDate: "2025-03-15",
  },
  {
    id: "u-agent-2",
    name: "James Rodriguez",
    email: "james@nestify.com",
    password: "agent123",
    role: "agent",
    phone: "+1 555-0201",
    joinDate: "2025-04-10",
  },
  {
    id: "u-customer-1",
    name: "John Smith",
    email: "customer@nestify.com",
    password: "customer123",
    role: "customer",
    phone: "+1 555-0300",
    joinDate: "2025-06-20",
  },
  {
    id: "u-customer-2",
    name: "Lisa Wong",
    email: "lisa@nestify.com",
    password: "customer123",
    role: "customer",
    phone: "+1 555-0301",
    joinDate: "2025-08-05",
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState(dummyUsers);
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser) as AuthUser);
      }

      const storedUsers = localStorage.getItem(REGISTERED_USERS_KEY);
      if (storedUsers) {
        setRegisteredUsers(
          JSON.parse(storedUsers) as (AuthUser & { password: string })[],
        );
      }
    } catch {
      /* ignore corrupt storage */
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registeredUsers));
  }, [registeredUsers, storageReady]);

  useEffect(() => {
    if (!storageReady) return;
    if (user) localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    else localStorage.removeItem(AUTH_KEY);
  }, [user, storageReady]);

  const login = useCallback(
    (email: string, password: string) => {
      console.log("Registered users:", registeredUsers);
      const found = registeredUsers.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password,
      );
      console.log("Login attempt:", { email, password, found });
      if (!found) return { success: false, error: "Invalid email or password" };
      const { password: _, ...authUser } = found;
      setUser(authUser);
      return { success: true };
    },
    [registeredUsers],
  );

  const register = useCallback(
    (name: string, email: string, password: string, role: UserRole) => {
      if (
        registeredUsers.some(
          (u) => u.email.toLowerCase() === email.toLowerCase(),
        )
      ) {
        return { success: false, error: "Email already registered" };
      }
      const newUser = {
        id: `u-${role}-${Date.now()}`,
        name,
        email,
        password,
        role,
        joinDate: new Date().toISOString().split("T")[0],
      };
      setRegisteredUsers((prev) => [...prev, newUser]);
      const { password: _, ...authUser } = newUser;
      setUser(authUser);
      return { success: true };
    },
    [registeredUsers],
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
