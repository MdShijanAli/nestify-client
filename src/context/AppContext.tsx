import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { Property, PropertyType, PropertyStatus } from "@/data/properties";
import { properties as initialProperties } from "@/data/properties";

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  property: string;
  propertyId: string;
  status: "New" | "Contacted" | "Closed";
  date: string;
  agent: string;
  message?: string;
}

export interface Booking {
  id: string;
  txnId: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  method: string;
  status: "Confirmed" | "Cancelled";
  date: string;
  visitDate?: string;
  visitTime?: string; // "HH:mm"
}

export interface AppNotification {
  id: string;
  recipient: string; // agent name (or "all")
  type:
    | "visit_scheduled"
    | "visit_rescheduled"
    | "visit_cancelled"
    | "lead"
    | "system";
  title: string;
  message: string;
  bookingId?: string;
  propertyId?: string;
  createdAt: string;
  read: boolean;
}

export interface AppUser {
  id: number;
  name: string;
  email: string;
  role: "User" | "Agent" | "Admin";
  status: "Active" | "Pending" | "Suspended";
  joined: string;
  listings?: number;
}

interface AppState {
  properties: Property[];
  leads: Lead[];
  users: AppUser[];
  bookings: Booking[];
  addBooking: (b: Omit<Booking, "id" | "date" | "status">) => Booking;
  cancelBooking: (id: string) => void;
  rescheduleVisit: (id: string, newDate: string, newTime?: string) => void;
  notifications: AppNotification[];
  addNotification: (
    n: Omit<AppNotification, "id" | "createdAt" | "read">,
  ) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (recipient?: string) => void;
  deleteNotification: (id: string) => void;
  favorites: string[];
  compareList: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  toggleCompare: (id: string) => void;
  isInCompare: (id: string) => boolean;
  clearCompare: () => void;
  addProperty: (p: Omit<Property, "id" | "dateListed">) => void;
  updateProperty: (id: string, p: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  toggleFeatured: (id: string) => void;
  addLead: (l: Omit<Lead, "id" | "date">) => void;
  updateLeadStatus: (id: number, status: Lead["status"]) => void;
  assignLeadAgent: (id: number, agent: string) => void;
  updateUserRole: (id: number, role: AppUser["role"]) => void;
  updateUserStatus: (id: number, status: AppUser["status"]) => void;
  deleteUser: (id: number) => void;
}

const AppContext = createContext<AppState | null>(null);

const initialLeads: Lead[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john@email.com",
    property: "Modern Luxury Apartment",
    propertyId: "PROP-001",
    status: "New",
    date: "2026-03-07",
    agent: "Sarah Mitchell",
  },
  {
    id: 2,
    name: "Lisa Wong",
    email: "lisa@email.com",
    property: "Classic Colonial Home",
    propertyId: "PROP-002",
    status: "Contacted",
    date: "2026-03-06",
    agent: "James Rodriguez",
  },
  {
    id: 3,
    name: "Mike Davis",
    email: "mike@email.com",
    property: "Skyline Penthouse Suite",
    propertyId: "PROP-004",
    status: "New",
    date: "2026-03-06",
    agent: "Unassigned",
  },
  {
    id: 4,
    name: "Anna Lee",
    email: "anna@email.com",
    property: "Premium Office Space",
    propertyId: "PROP-003",
    status: "Closed",
    date: "2026-03-04",
    agent: "Sarah Mitchell",
  },
  {
    id: 5,
    name: "Tom Brown",
    email: "tom@email.com",
    property: "Charming Brick Townhouse",
    propertyId: "PROP-005",
    status: "Contacted",
    date: "2026-03-05",
    agent: "James Rodriguez",
  },
];

const initialUsers: AppUser[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    role: "User",
    status: "Active",
    joined: "2025-12-01",
  },
  {
    id: 2,
    name: "Sarah Mitchell",
    email: "sarah@estate.com",
    role: "Agent",
    status: "Active",
    joined: "2025-11-15",
    listings: 2,
  },
  {
    id: 3,
    name: "James Rodriguez",
    email: "james@estate.com",
    role: "Agent",
    status: "Active",
    joined: "2025-10-20",
    listings: 2,
  },
  {
    id: 4,
    name: "Emily Chen",
    email: "emily@estate.com",
    role: "Agent",
    status: "Pending",
    joined: "2026-01-05",
    listings: 2,
  },
  {
    id: 5,
    name: "Mike Davis",
    email: "mike@example.com",
    role: "User",
    status: "Suspended",
    joined: "2025-09-10",
  },
  {
    id: 6,
    name: "Lisa Wong",
    email: "lisa@example.com",
    role: "User",
    status: "Active",
    joined: "2026-02-20",
  },
];

let nextPropId = 7;
let nextLeadId = 6;

export function AppProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [users, setUsers] = useState<AppUser[]>(initialUsers);
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("estatehub_bookings") || "[]");
    } catch {
      return [];
    }
  });
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("estatehub_notifications") || "[]",
      );
    } catch {
      return [];
    }
  });

  const persistBookings = (next: Booking[]) => {
    localStorage.setItem("estatehub_bookings", JSON.stringify(next));
    return next;
  };
  const persistNotifications = (next: AppNotification[]) => {
    localStorage.setItem("estatehub_notifications", JSON.stringify(next));
    return next;
  };

  const addNotification = useCallback(
    (n: Omit<AppNotification, "id" | "createdAt" | "read">) => {
      const note: AppNotification = {
        ...n,
        id: `NTF-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        createdAt: new Date().toISOString(),
        read: false,
      };
      setNotifications((prev) => persistNotifications([note, ...prev]));
    },
    [],
  );

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      persistNotifications(
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      ),
    );
  }, []);

  const markAllNotificationsRead = useCallback((recipient?: string) => {
    setNotifications((prev) =>
      persistNotifications(
        prev.map((n) =>
          !recipient || n.recipient === recipient || n.recipient === "all"
            ? { ...n, read: true }
            : n,
        ),
      ),
    );
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      persistNotifications(prev.filter((n) => n.id !== id)),
    );
  }, []);

  const findAgentForProperty = (propertyId: string) =>
    properties.find((p) => p.id === propertyId)?.agentName;

  const addBooking = (b: Omit<Booking, "id" | "date" | "status">): Booking => {
    const newBooking: Booking = {
      ...b,
      id: `BK-${Date.now()}`,
      date: new Date().toISOString(),
      status: "Confirmed",
    };
    setBookings((prev) => persistBookings([newBooking, ...prev]));
    const agent = findAgentForProperty(b.propertyId);
    if (agent && b.visitDate) {
      const when = new Date(b.visitDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      addNotification({
        recipient: agent,
        type: "visit_scheduled",
        title: "New Visit Scheduled",
        message: `${b.customerName} scheduled a visit to ${b.propertyTitle} on ${when}${b.visitTime ? ` at ${b.visitTime}` : ""}.`,
        bookingId: newBooking.id,
        propertyId: b.propertyId,
      });
    }
    return newBooking;
  };

  const cancelBooking = (id: string) => {
    let cancelled: Booking | undefined;
    setBookings((prev) => {
      const next = prev.map((b) => {
        if (b.id === id) {
          cancelled = { ...b, status: "Cancelled" as const };
          return cancelled;
        }
        return b;
      });
      return persistBookings(next);
    });
    if (cancelled) {
      const agent = findAgentForProperty(cancelled.propertyId);
      if (agent) {
        addNotification({
          recipient: agent,
          type: "visit_cancelled",
          title: "Visit Cancelled",
          message: `${cancelled.customerName} cancelled their visit to ${cancelled.propertyTitle}.`,
          bookingId: cancelled.id,
          propertyId: cancelled.propertyId,
        });
      }
    }
  };

  const rescheduleVisit = (id: string, newDate: string, newTime?: string) => {
    let updated: Booking | undefined;
    setBookings((prev) => {
      const next = prev.map((b) => {
        if (b.id === id) {
          updated = {
            ...b,
            visitDate: newDate,
            ...(newTime !== undefined ? { visitTime: newTime } : {}),
          };
          return updated;
        }
        return b;
      });
      return persistBookings(next);
    });
    if (updated) {
      const agent = findAgentForProperty(updated.propertyId);
      if (agent) {
        const when = new Date(newDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        addNotification({
          recipient: agent,
          type: "visit_rescheduled",
          title: "Visit Rescheduled",
          message: `${updated.customerName} rescheduled their visit to ${updated.propertyTitle} → ${when}${updated.visitTime ? ` at ${updated.visitTime}` : ""}.`,
          bookingId: updated.id,
          propertyId: updated.propertyId,
        });
      }
    }
  };

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("estatehub_favorites") || "[]");
    } catch {
      return [];
    }
  });

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id];
      localStorage.setItem("estatehub_favorites", JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites],
  );

  const [compareList, setCompareList] = useState<string[]>([]);

  const toggleCompare = useCallback((id: string) => {
    setCompareList((prev) => {
      if (prev.includes(id)) return prev.filter((c) => c !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  }, []);

  const isInCompare = useCallback(
    (id: string) => compareList.includes(id),
    [compareList],
  );
  const clearCompare = useCallback(() => setCompareList([]), []);

  const addProperty = (p: Omit<Property, "id" | "dateListed">) => {
    const newProp: Property = {
      ...p,
      id: `PROP-${String(nextPropId++).padStart(3, "0")}`,
      dateListed: new Date().toISOString().split("T")[0],
    };
    setProperties((prev) => [newProp, ...prev]);
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    );
  };

  const deleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleFeatured = (id: string) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p)),
    );
  };

  const addLead = (l: Omit<Lead, "id" | "date">) => {
    setLeads((prev) => [
      { ...l, id: nextLeadId++, date: new Date().toISOString().split("T")[0] },
      ...prev,
    ]);
  };

  const updateLeadStatus = (id: number, status: Lead["status"]) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const assignLeadAgent = (id: number, agent: string) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, agent } : l)));
  };

  const updateUserRole = (id: number, role: AppUser["role"]) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
  };

  const updateUserStatus = (id: number, status: AppUser["status"]) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
  };

  const deleteUser = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        properties,
        leads,
        users,
        bookings,
        addBooking,
        cancelBooking,
        rescheduleVisit,
        notifications,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        favorites,
        compareList,
        toggleFavorite,
        isFavorite,
        toggleCompare,
        isInCompare,
        clearCompare,
        addProperty,
        updateProperty,
        deleteProperty,
        toggleFeatured,
        addLead,
        updateLeadStatus,
        assignLeadAgent,
        updateUserRole,
        updateUserStatus,
        deleteUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppState must be used within AppProvider");
  return ctx;
}
