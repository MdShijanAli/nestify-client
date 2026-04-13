"use client";

import { useEffect, useState, startTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Heart,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Phone,
  Search,
  Sun,
  User,
  X,
} from "lucide-react";
import { useAppState } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/properties", label: "Properties", icon: Search },
  { href: "/saved", label: "Saved", icon: Heart },
  { href: "/contact", label: "Contact", icon: Phone },
] as const;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { favorites } = useAppState();
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    startTransition(() => {
      const root = document.documentElement;
      const stored = localStorage.getItem("theme");
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      const dark = stored ? stored === "dark" : prefersDark;

      root.classList.toggle("dark", dark);
      setIsDark(dark);
      setMounted(true);
    });
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !isDark;
    const root = document.documentElement;
    root.classList.toggle("dark", nextDark);
    localStorage.setItem("theme", nextDark ? "dark" : "light");
    setIsDark(nextDark);
  };

  const linkActive = (href: string) => pathname === href;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-lg">
            <Home className="text-primary-foreground h-5 w-5" />
          </div>
          <span className="font-heading text-xl font-bold text-foreground">
            Nestify
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                linkActive(link.href)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {link.label}
              {link.href === "/saved" && favorites.length > 0 ? (
                <span className="bg-destructive text-destructive-foreground absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold">
                  {favorites.length}
                </span>
              ) : null}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={toggleDarkMode}
          >
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          {isAuthenticated ? (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">
                  <User className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={toggleDarkMode}
          >
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-card overflow-hidden border-t md:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`relative rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    linkActive(link.href)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                  {link.href === "/saved" && favorites.length > 0 ? (
                    <span className="bg-destructive text-destructive-foreground absolute top-2 right-3 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold">
                      {favorites.length}
                    </span>
                  ) : null}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Button
                    variant="outline"
                    className="mt-2 w-full"
                    size="sm"
                    asChild
                  >
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full"
                    size="sm"
                    type="button"
                    onClick={() => {
                      logout();
                      router.push("/");
                      setMobileOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="mt-2 w-full"
                    size="sm"
                    asChild
                  >
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <User className="mr-2 h-4 w-4" />
                      Login
                    </Link>
                  </Button>
                  <Button className="w-full" size="sm" asChild>
                    <Link href="/register" onClick={() => setMobileOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </nav>
  );
}
