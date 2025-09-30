import Sidebar from "./components/Sidebar";
import Map from "./components/MapDefault";

export default function Home() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <Map />
    </div>
  );
}
