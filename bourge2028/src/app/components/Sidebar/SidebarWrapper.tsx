"use client";
import { useState, useEffect, Suspense, lazy } from "react";
import SidebarSkeleton from "./SidebarSkeleton";

// Chargement différé du composant Sidebar complet
const Sidebar = lazy(() => import("./Sidebar.jsx"));

interface SidebarWrapperProps {
  map: any;
  onFilterChange?: (filter: string) => void;
  onDepFilterChange?: (departements: any[]) => void;
  onSearchStructChange?: string;
  isAnnuaire?: boolean;
}

export default function SidebarWrapper({ 
  map, 
  onFilterChange, 
  onDepFilterChange ,
  onSearchStructChange,
  isAnnuaire
}: SidebarWrapperProps) {
  const [isClient, setIsClient] = useState(false);
  const [shouldLoadFull, setShouldLoadFull] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Charge le composant complet après un court délai
    // ou dès que la map est prête
    const timer = setTimeout(() => {
      setShouldLoadFull(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Deuxième effet pour détecter quand la map est prête
  useEffect(() => {
    if (map) {
      setShouldLoadFull(true);
    }
  }, [map]);

  // Pendant le SSR ou avant le chargement client
  if (!isClient) {
    return <SidebarSkeleton onFilterChange={onFilterChange} />;
  }

  // Après le chargement client, affiche le skeleton puis le vrai composant
  if (!shouldLoadFull) {
    return <SidebarSkeleton onFilterChange={onFilterChange} />;
  }

  return (
    <Suspense fallback={<SidebarSkeleton onFilterChange={onFilterChange} />}>
      <Sidebar 
        map={map} 
        onFilterChange={onFilterChange} 
        onDepFilterChange={onDepFilterChange} 
        onSearchStructChange={onSearchStructChange}
        isAnnuaire={isAnnuaire}
      />
    </Suspense>
  );
}