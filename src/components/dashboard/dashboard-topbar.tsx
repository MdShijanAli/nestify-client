"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Sun,
  Moon,
  User,
  KeyRound,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useAppState } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DashboardTopbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } =
    useAppState();
  const [isDark, setIsDark] = useState(false);

  const myNotifications = useMemo(() => {
    if (!user) return [];
    return notifications.filter(
      (n) => n.recipient === user.name || n.recipient === "all",
    );
  }, [notifications, user]);

  const unreadCount = myNotifications.filter((n) => !n.read).length;

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const dark = stored ? stored === "dark" : prefersDark;
    root.classList.toggle("dark", dark);
    setIsDark(dark);
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !isDark;
    const root = document.documentElement;
    root.classList.toggle("dark", nextDark);
    localStorage.setItem("theme", nextDark ? "dark" : "light");
    setIsDark(nextDark);
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-card/80 px-4 backdrop-blur-xl md:px-6">
      <div className="text-sm font-medium text-muted-foreground capitalize">
        {user?.role ?? "user"} Dashboard
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          type="button"
          className="h-9 w-9"
          onClick={toggleDarkMode}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h4 className="text-sm font-semibold">Notifications</h4>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllNotificationsRead(user?.name)}
                  className="text-xs text-primary hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {myNotifications.length === 0 ? (
                <p className="p-6 text-center text-sm text-muted-foreground">
                  No notifications yet
                </p>
              ) : (
                myNotifications.slice(0, 8).map((n) => (
                  <button
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={cn(
                      "flex w-full flex-col gap-0.5 border-b px-4 py-3 text-left transition-colors hover:bg-muted/50 last:border-0",
                      !n.read && "bg-primary/5",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {!n.read && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                      )}
                      <span className="text-sm font-medium">{n.title}</span>
                    </div>
                    <p className="pl-4 text-xs text-muted-foreground">
                      {n.message}
                    </p>
                    <p className="pl-4 text-[11px] text-muted-foreground/70">
                      {formatDistanceToNow(new Date(n.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </button>
                ))
              )}
            </div>

            <div className="border-t px-4 py-2">
              <button
                onClick={() => router.push("/dashboard/notifications")}
                className="w-full text-center text-xs font-medium text-primary hover:underline"
              >
                View all notifications
              </button>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-9 items-center gap-2 px-2"
              type="button"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {user?.name ? (
                  getInitials(user.name)
                ) : (
                  <User className="h-3 w-3" />
                )}
              </span>
              <span className="hidden text-sm font-medium text-foreground sm:inline-block">
                {user?.name ?? "User"}
              </span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Button>
          </PopoverTrigger>

          <PopoverContent align="end" className="w-52 p-2">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium text-foreground">
                {user?.name ?? "User"}
              </p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>

            <div className="my-1 border-t" />

            <Button asChild variant="ghost" className="w-full justify-start">
              <Link href="/dashboard/profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </Button>

            <Button asChild variant="ghost" className="w-full justify-start">
              <Link href="/dashboard/change-password">
                <KeyRound className="mr-2 h-4 w-4" />
                Change Password
              </Link>
            </Button>

            <div className="my-1 border-t" />

            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={() => {
                logout();
                router.push("/login");
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
