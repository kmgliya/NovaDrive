import { AdminShell } from "@/widgets/admin-dashboard/ui/AdminShell";
import { CarManagement } from "@/widgets/admin-dashboard/ui/CarManagement";
import { DashboardOverview } from "@/widgets/admin-dashboard/ui/DashboardOverview";
import { SpecialistManagement } from "@/widgets/admin-dashboard/ui/SpecialistManagement";

const AdminPage = () => {
  return (
    <AdminShell>
      <DashboardOverview />
      <CarManagement />
      <SpecialistManagement />
    </AdminShell>
  );
};

export default AdminPage;
