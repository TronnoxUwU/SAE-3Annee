"use client";
import { useState } from "react";
import "../styles/Sidebar.css";

interface SidebarSkeletonProps {
  onFilterChange?: (filter: string) => void;
}

export default function SidebarSkeleton({ onFilterChange }: SidebarSkeletonProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className={`sidebar ${open ? "" : "collapsed"}`}>
      {/* Zone de recherche - désactivée pendant le chargement */}
      <div className="sidebar-search">
        <input
          type="text"
          id="findbox"
          placeholder="Chargement..."
          disabled
          style={{ opacity: 0.6, cursor: "not-allowed" }}
        />
      </div>

      {/* Header avec bouton collapse */}
      <div className="sidebar-header">
        {open && <span>Menu</span>}
        <button onClick={() => setOpen(!open)}>
          {open ? "<" : ">"}
        </button>
      </div>

      {/* Skeleton des filtres */}
      <ul className="filter-list">
        {[1, 2, 3, 4, 5].map((i) => (
          <li 
            key={i} 
            style={{ 
              opacity: 0.4, 
              cursor: "wait",
              background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite"
            }}
          >
            {open ? "Chargement..." : `T${i}`}
          </li>
        ))}
      </ul>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
