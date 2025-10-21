import DashboardServer from "./components/dashboard";
import Topbar from "@/components/Topbar.jsx";
import AdminSidebar from "../components/admin-sidebar";

// import "../styles/admin.css";
import "./styles/dashboard.css";

export default function DashboardPage() {
  return (
    <>
    <Topbar title="Dashboard"/>
    <div className="admin-content">
      <AdminSidebar />
      <main>
          <DashboardServer />
      </main>
    </div>
    </>
  );
}
