import { AdminGuard } from "@/shared/lib/auth/AdminGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminGuard>{children}</AdminGuard>;
}
