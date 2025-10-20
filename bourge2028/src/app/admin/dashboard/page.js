import DashboardServer from "./components/dashboard";
import Topbar from "@/components/Topbar.jsx";

export default function DashboardPage() {
  return (
    <main>
      <Topbar title="Dashboard"/>
      <DashboardServer />
    </main>
  );
}
