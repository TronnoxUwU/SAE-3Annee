"use client";
import { useState } from "react";
import Style from "./Sidebar.module.css";

interface SidebarSkeletonProps {
  onFilterChange?: (filter: string) => void;
}

export default function SidebarSkeleton({ onFilterChange }: SidebarSkeletonProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className={`${Style.sidebar} ${open ? "" : "collapsed"}`}>
      {/* Zone de recherche - désactivée pendant le chargement */}
      <div className={Style.sidebar_search}>
        <input
          type="text"
          id={Style.findbox}
          placeholder="Chargement..."
          disabled
          style={{ opacity: 0.6, cursor: "not-allowed" }}
        />
      </div>

      {/* Skeleton des filtres */}
      <ul className={Style.filter_list}>
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
