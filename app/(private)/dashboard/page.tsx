import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AdminDashboardPage } from "@/components/pages/dashboard/admin-dashboard-page";

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminDashboardPage />
    </div>
  );
}
