export type UserRole = "admin" | "user";

export interface User {
  id: string;
  name: string;
  phone: string;
  role?: UserRole;
  avatar?: string;
  email?: string;
}