import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Booking } from "@/entities/booking/model/types";
import { Car } from "@/entities/car/model/types";
import { Service } from "@/entities/service/model/types";
import { Specialist } from "@/entities/specialist/model/types";
import { User } from "@/entities/user/model/types";
import {
  MOCK_BOOKINGS,
  MOCK_CARS,
  MOCK_REVENUE,
  MOCK_SERVICES,
  MOCK_SPECIALISTS,
  MOCK_USERS,
} from "@/shared/api/mock-data";

type DashboardSnapshot = {
  totalRevenue: number;
  activeRentals: number;
  revenueSeries: Array<{ label: string; revenue: number }>;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const randomFail = (rate = 0.15) => Math.random() < rate;

type SlotLock = {
  slotId: string;
  specialistId: string;
  startTime: string;
  endTime: string;
  lockedBy: string;
  expiresAt: number;
};

const BOOKINGS_KEY = "novadrive-bookings";
const SPECIALISTS_KEY = "novadrive-specialists";

const loadFromStorage = <T,>(key: string): T | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const saveToStorage = <T,>(key: string, value: T) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
};

let bookings = loadFromStorage<Booking[]>(BOOKINGS_KEY) ?? [...MOCK_BOOKINGS];
const services = [...MOCK_SERVICES];
let specialists = loadFromStorage<Specialist[]>(SPECIALISTS_KEY) ?? [...MOCK_SPECIALISTS];
const users = [...MOCK_USERS];
const slotLocks = new Map<string, SlotLock>();

const cleanupExpiredLocks = () => {
  const now = Date.now();
  slotLocks.forEach((lock, key) => {
    if (lock.expiresAt <= now) {
      slotLocks.delete(key);
    }
  });
};

const getDashboardSnapshot = (): DashboardSnapshot => {
  const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.price ?? 0), 0);
  const activeRentals = bookings.filter((booking) => booking.status === "active").length;

  return {
    totalRevenue,
    activeRentals,
    revenueSeries: MOCK_REVENUE,
  };
};

const hasBookingConflict = (
  specialistId: string,
  startTime: string,
  endTime: string,
  ignoreBookingId?: string
) => {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();

  return bookings.some((booking) => {
    if (ignoreBookingId && booking.id === ignoreBookingId) return false;
    if (booking.specialistId !== specialistId) return false;
    if (!booking.startTime || !booking.endTime) return false;
    if (booking.status === "cancelled") return false;
    const existingStart = new Date(booking.startTime).getTime();
    const existingEnd = new Date(booking.endTime).getTime();
    return start < existingEnd && end > existingStart;
  });
};

const mockAdapter = async (config: AxiosRequestConfig): Promise<AxiosResponse> => {
  await sleep(350);
  const parsePayload = <T,>(data: unknown): T => {
    if (!data) return {} as T;
    if (typeof data === "string") {
      return JSON.parse(data) as T;
    }
    return data as T;
  };

  const url = config.url ?? "";
  const method = (config.method ?? "get").toLowerCase();
  cleanupExpiredLocks();

  if (method === "get" && url === "/cars") {
    return { data: MOCK_CARS, status: 200, statusText: "OK", headers: {}, config };
  }

  if (method === "get" && url === "/users") {
    return { data: users, status: 200, statusText: "OK", headers: {}, config };
  }

  if (method === "get" && url === "/services") {
    return { data: services, status: 200, statusText: "OK", headers: {}, config };
  }

  if (method === "get" && url === "/specialists") {
    const stored = loadFromStorage<Specialist[]>(SPECIALISTS_KEY);
    if (stored) specialists = stored;
    return { data: specialists, status: 200, statusText: "OK", headers: {}, config };
  }

  if (method === "get" && url === "/bookings") {
    const stored = loadFromStorage<Booking[]>(BOOKINGS_KEY);
    if (stored) bookings = stored;
    return { data: bookings, status: 200, statusText: "OK", headers: {}, config };
  }

  if (method === "get" && url === "/dashboard") {
    return { data: getDashboardSnapshot(), status: 200, statusText: "OK", headers: {}, config };
  }

  if (method === "post" && url === "/slots/lock") {
    const { slotId, specialistId, startTime, endTime, userId, ttlMs } = parsePayload<{
      slotId: string;
      specialistId: string;
      startTime: string;
      endTime: string;
      userId: string;
      ttlMs?: number;
    }>(config.data);
    if (slotLocks.has(slotId)) {
      const lock = slotLocks.get(slotId);
      if (lock && lock.lockedBy !== userId) {
        return { data: { message: "Slot already locked" }, status: 409, statusText: "Conflict", headers: {}, config };
      }
    }
    if (hasBookingConflict(specialistId, startTime, endTime)) {
      return { data: { message: "Slot already booked" }, status: 409, statusText: "Conflict", headers: {}, config };
    }
    if (randomFail(0.1)) {
      return { data: { message: "Temporary lock error" }, status: 503, statusText: "Service Unavailable", headers: {}, config };
    }
    const lock: SlotLock = {
      slotId,
      specialistId,
      startTime,
      endTime,
      lockedBy: userId,
      expiresAt: Date.now() + (ttlMs ?? 5 * 60_000),
    };
    slotLocks.set(slotId, lock);
    return { data: lock, status: 200, statusText: "OK", headers: {}, config };
  }

  if (method === "delete" && url === "/slots/lock") {
    const { slotId, userId } = parsePayload<{ slotId: string; userId: string }>(config.data);
    const lock = slotLocks.get(slotId);
    if (lock && lock.lockedBy === userId) {
      slotLocks.delete(slotId);
    }
    return { data: { released: true }, status: 200, statusText: "OK", headers: {}, config };
  }

  if (method === "post" && url === "/bookings") {
    const { serviceId, specialistId, timeSlotId, client, startTime, endTime, price } = parsePayload<{
      serviceId: string;
      specialistId: string;
      timeSlotId: string;
      client: User;
      startTime: string;
      endTime: string;
      price?: number;
    }>(config.data);
    if (randomFail(0)) {
      return { data: { message: "Temporary booking error" }, status: 500, statusText: "Error", headers: {}, config };
    }
    const lock = slotLocks.get(timeSlotId);
    if (!lock || lock.lockedBy !== client.id) {
      return { data: { message: "Slot not locked by user" }, status: 409, statusText: "Conflict", headers: {}, config };
    }
    if (hasBookingConflict(specialistId, startTime, endTime)) {
      return { data: { message: "Slot already booked" }, status: 409, statusText: "Conflict", headers: {}, config };
    }
    const newBooking: Booking = {
      id: `b-${Date.now()}`,
      serviceId,
      specialistId,
      timeSlotId,
      client,
      status: "active",
      createdAt: new Date().toISOString(),
      price,
      startTime,
      endTime,
    };
    bookings = [newBooking, ...bookings];
    saveToStorage(BOOKINGS_KEY, bookings);
    slotLocks.delete(timeSlotId);
    return { data: newBooking, status: 201, statusText: "Created", headers: {}, config };
  }

  if (method === "patch" && url.startsWith("/bookings/")) {
    const bookingId = url.replace("/bookings/", "");
    const payload = parsePayload<Partial<Booking>>(config.data);
    if (randomFail(0.2)) {
      return { data: { message: "Reschedule failed" }, status: 500, statusText: "Error", headers: {}, config };
    }
    const index = bookings.findIndex((booking) => booking.id === bookingId);
    if (index === -1) {
      return { data: { message: "Booking not found" }, status: 404, statusText: "Not Found", headers: {}, config };
    }
    const current = bookings[index];
    const next = { ...current, ...payload } as Booking;
    if (payload.startTime && payload.endTime) {
      if (hasBookingConflict(current.specialistId, payload.startTime, payload.endTime, bookingId)) {
        return { data: { message: "Slot already booked" }, status: 409, statusText: "Conflict", headers: {}, config };
      }
    }
    bookings[index] = next;
    saveToStorage(BOOKINGS_KEY, bookings);
    return { data: next, status: 200, statusText: "OK", headers: {}, config };
  }

  if (method === "patch" && url.startsWith("/specialists/")) {
    const specialistId = url.replace("/specialists/", "");
    const payload = parsePayload<Partial<Specialist>>(config.data);
    const index = specialists.findIndex((spec) => spec.id === specialistId);
    if (index === -1) {
      return { data: { message: "Specialist not found" }, status: 404, statusText: "Not Found", headers: {}, config };
    }
    specialists[index] = { ...specialists[index], ...payload };
    saveToStorage(SPECIALISTS_KEY, specialists);
    return { data: specialists[index], status: 200, statusText: "OK", headers: {}, config };
  }

  return { data: null, status: 404, statusText: "Not Found", headers: {}, config };
};

export const mockApi = axios.create({
  adapter: mockAdapter,
});

export const fetchCars = async (): Promise<Car[]> => {
  const { data } = await mockApi.get<Car[]>("/cars");
  return data;
};

export const fetchUsers = async (): Promise<User[]> => {
  const { data } = await mockApi.get<User[]>("/users");
  return data;
};

export const fetchServices = async (): Promise<Service[]> => {
  const { data } = await mockApi.get<Service[]>("/services");
  return data;
};

export const fetchSpecialists = async (): Promise<Specialist[]> => {
  const { data } = await mockApi.get<Specialist[]>("/specialists");
  return data;
};

export const fetchBookings = async (): Promise<Booking[]> => {
  const { data } = await mockApi.get<Booking[]>("/bookings");
  return data;
};

export const lockSlot = async (payload: {
  slotId: string;
  specialistId: string;
  startTime: string;
  endTime: string;
  userId: string;
  ttlMs?: number;
}) => {
  const { data } = await mockApi.post("/slots/lock", payload);
  return data as SlotLock;
};

export const releaseSlot = async (payload: { slotId: string; userId: string }) => {
  const { data } = await mockApi.delete("/slots/lock", { data: payload });
  return data as { released: boolean };
};

export const createBooking = async (payload: {
  serviceId: string;
  specialistId: string;
  timeSlotId: string;
  client: User;
  startTime: string;
  endTime: string;
  price?: number;
}) => {
  const { data } = await mockApi.post<Booking>("/bookings", payload);
  return data;
};

export const rescheduleBooking = async (
  bookingId: string,
  payload: { timeSlotId: string; startTime: string; endTime: string }
) => {
  const { data } = await mockApi.patch<Booking>(`/bookings/${bookingId}`, payload);
  return data;
};

export const cancelBooking = async (bookingId: string) => {
  const { data } = await mockApi.patch<Booking>(`/bookings/${bookingId}`, { status: "cancelled" });
  return data;
};

export const updateSpecialist = async (specialistId: string, payload: Partial<Specialist>) => {
  const { data } = await mockApi.patch<Specialist>(`/specialists/${specialistId}`, payload);
  return data;
};

export const fetchDashboard = async (): Promise<DashboardSnapshot> => {
  const { data } = await mockApi.get<DashboardSnapshot>("/dashboard");
  return data;
};
