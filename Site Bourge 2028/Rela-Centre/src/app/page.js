import Sidebar from "./components/Sidebar";
import MapDefault from "./components/MapDefault";

export default function Home() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <MapDefault />
    </div>
  );
}
