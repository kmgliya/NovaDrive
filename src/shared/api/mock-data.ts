import { Booking } from "@/entities/booking/model/types";
import { Car } from "@/entities/car/model/types";
import { Service } from "@/entities/service/model/types";
import { Specialist } from "@/entities/specialist/model/types";
import { User } from "@/entities/user/model/types";
import { WeeklySchedule } from "@/entities/schedule/model/types";

export const MOCK_CARS: Car[] = [
  {
    id: '1',
    brand: 'BMW',
    name: 'M5 Competition',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop',
    pricePerHour: 150,
    category: 'sport',
    workingHours: {
      start: '09:00',
      end: '21:00',
    },
    bufferTime: 60,
  },
  {
    id: '2',
    brand: 'Mercedes',
    name: 'G 63 AMG',
    image: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=2000&auto=format&fit=crop',
    pricePerHour: 200,
    category: 'suv',
    workingHours: {
      start: '08:00',
      end: '22:00',
    },
    bufferTime: 90,
  },
  {
    id: '3',
    brand: 'Porsche',
    name: '911 Carrera S',
    image: 'https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2070&auto=format&fit=crop',
    pricePerHour: 180,
    category: 'sport',
    workingHours: {
      start: '10:00',
      end: '20:00',
    },
    bufferTime: 60,
  },
  {
    id: '4',
    brand: 'Tesla',
    name: 'Model S Plaid',
    image: 'https://images.unsplash.com/photo-1617704548623-29a1921398c9?q=80&w=2070&auto=format&fit=crop',
    pricePerHour: 120,
    category: 'electric',
    workingHours: {
      start: '08:00',
      end: '22:00',
    },
    bufferTime: 45,
  }
];

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Daria Romanova',
    phone: '+1 (212) 555-0199',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    email: 'daria@novadrive.com',
  },
  {
    id: 'u2',
    name: 'Mark Spencer',
    phone: '+1 (212) 555-0161',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=400&auto=format&fit=crop',
    email: 'mark@gmail.com',
  },
  {
    id: 'u3',
    name: 'Sofia Lambert',
    phone: '+1 (212) 555-0114',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=400&auto=format&fit=crop',
    email: 'sofia@gmail.com',
  },
];

const DEFAULT_WEEKLY: WeeklySchedule = {
  0: null,
  1: { start: "09:00", end: "18:00" },
  2: { start: "10:00", end: "19:00" },
  3: { start: "09:00", end: "18:00" },
  4: { start: "11:00", end: "20:00" },
  5: { start: "10:00", end: "16:00" },
  6: null,
};

export const MOCK_SERVICES: Service[] = [
  {
    id: "s1",
    title: "Premium detailing",
    image: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=2000&auto=format&fit=crop",
    durationMins: 60,
    price: 180,
    bufferBeforeMins: 10,
    bufferAfterMins: 15,
  },
  {
    id: "s2",
    title: "Ceramic protection",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2000&auto=format&fit=crop",
    durationMins: 120,
    price: 420,
    bufferBeforeMins: 15,
    bufferAfterMins: 20,
  },
  {
    id: "s3",
    title: "Executive chauffeur",
    image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=2000&auto=format&fit=crop",
    durationMins: 90,
    price: 300,
    bufferBeforeMins: 10,
    bufferAfterMins: 10,
  },
  {
    id: "s4",
    title: "Interior refresh",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2000&auto=format&fit=crop",
    durationMins: 45,
    price: 140,
    bufferBeforeMins: 5,
    bufferAfterMins: 10,
  },
];

export const MOCK_SPECIALISTS: Specialist[] = [
  {
    id: "sp1",
    name: "Alexei Morozov",
    specialization: "Detailing lead",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    workingHours: DEFAULT_WEEKLY,
    serviceIds: ["s1", "s2", "s4"],
  },
  {
    id: "sp2",
    name: "Lina Ortega",
    specialization: "Chauffeur supervisor",
    avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=400&auto=format&fit=crop",
    workingHours: {
      ...DEFAULT_WEEKLY,
      4: { start: "09:00", end: "17:00" },
      5: { start: "09:00", end: "15:00" },
    },
    serviceIds: ["s3"],
  },
  {
    id: "sp3",
    name: "Marco Ren",
    specialization: "Premium care",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
    workingHours: {
      ...DEFAULT_WEEKLY,
      2: { start: "12:00", end: "20:00" },
      5: { start: "10:00", end: "18:00" },
    },
    serviceIds: ["s1", "s4"],
  },
  {
    id: "sp4",
    name: "Olivia Cheng",
    specialization: "Ceramic specialist",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop",
    workingHours: {
      ...DEFAULT_WEEKLY,
      1: { start: "08:00", end: "16:00" },
      3: { start: "12:00", end: "20:00" },
    },
    serviceIds: ["s2", "s4"],
  },
  {
    id: "sp5",
    name: "Noah Fischer",
    specialization: "Executive care",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop",
    workingHours: {
      ...DEFAULT_WEEKLY,
      2: { start: "09:00", end: "17:00" },
      4: { start: "10:00", end: "18:00" },
    },
    serviceIds: ["s1", "s3"],
  },
  {
    id: "sp6",
    name: "Amelia Rossi",
    specialization: "Detailing specialist",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop",
    workingHours: {
      ...DEFAULT_WEEKLY,
      1: { start: "11:00", end: "19:00" },
      5: { start: "09:00", end: "17:00" },
    },
    serviceIds: ["s1", "s2", "s4"],
  },
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: "b1",
    serviceId: "s1",
    specialistId: "sp1",
    timeSlotId: "slot-2026-02-01-10-00",
    client: MOCK_USERS[1],
    status: "active",
    createdAt: "2026-01-25T09:40:00.000Z",
    price: 180,
    startTime: "2026-02-01T10:00:00.000Z",
    endTime: "2026-02-01T11:00:00.000Z",
  },
  {
    id: "b2",
    serviceId: "s2",
    specialistId: "sp1",
    timeSlotId: "slot-2026-02-02-12-00",
    client: MOCK_USERS[2],
    status: "active",
    createdAt: "2026-01-28T11:10:00.000Z",
    price: 420,
    startTime: "2026-02-02T12:00:00.000Z",
    endTime: "2026-02-02T14:00:00.000Z",
  },
  {
    id: "b3",
    serviceId: "s3",
    specialistId: "sp2",
    timeSlotId: "slot-2026-01-29-09-00",
    client: MOCK_USERS[1],
    status: "completed",
    createdAt: "2026-01-10T08:30:00.000Z",
    price: 300,
    startTime: "2026-01-29T09:00:00.000Z",
    endTime: "2026-01-29T10:30:00.000Z",
  },
];

export const MOCK_REVENUE = [
  { label: 'Mon', revenue: 1240 },
  { label: 'Tue', revenue: 980 },
  { label: 'Wed', revenue: 1580 },
  { label: 'Thu', revenue: 1920 },
  { label: 'Fri', revenue: 2140 },
  { label: 'Sat', revenue: 2680 },
  { label: 'Sun', revenue: 1750 },
];