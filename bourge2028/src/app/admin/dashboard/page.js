import DashboardClient from "./components/dashboard";
import Topbar from "@/components/Topbar.jsx";
import AdminSidebar from "../components/Sidebar/admin-sidebar";

// import "../styles/admin.css";
import Style from "./styles/dashboard.module.css";

export default function DashboardPage() {

  return (
    <>
    <Topbar title="Bourges 2028 - Dashboard"/>
    <div className="admin-content">
      <AdminSidebar />
      <main className={Style.dashboard}>
          <DashboardClient />
      </main>
    </div>
    </>
  );
}
