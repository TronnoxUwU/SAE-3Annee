import Link from "next/link";
import Style from "./admin-carousel.module.css";

const links = [
  { label: "Dashboard", path: "/admin/dashboard", icon: "bi-speedometer2", desc: "Statistiques & trafic" },
  { label: "Catégories", path: "/admin/categories", icon: "bi-tags", desc: "Gestion des catégories" },
  { label: "Structures", path: "/admin/structures", icon: "bi-building", desc: "Structures du site" },
  { label: "Validation", path: "/admin/waiting", icon: "bi-hourglass-split", desc: "Contenus en attente" },
];

export default function AdminQuickLinks() {
  return (
    <section className={Style.links_grid}>
      {links.map(link => (
        <Link key={link.path} href={link.path} className={Style.card}>
          <i className={`bi ${link.icon}`}></i>
          <h3>{link.label}</h3>
          <p>{link.desc}</p>
        </Link>
      ))}
    </section>
  );
}
