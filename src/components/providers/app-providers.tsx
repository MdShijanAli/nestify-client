"use client";

import { ThemeProvider } from "next-themes";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <AppProvider>
          {children}
          <Toaster />
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
