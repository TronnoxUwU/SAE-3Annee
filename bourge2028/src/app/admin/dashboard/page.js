import DashboardServer from "./components/server";
import Topbar from "@/components/Topbar.jsx";

export default function DashboardPage() {
  return (
    <main>
      <Topbar title="Dashboard"/>
      <DashboardServer />
    </main>
  );
}
