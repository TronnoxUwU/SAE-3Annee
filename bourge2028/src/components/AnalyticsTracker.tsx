"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: pathname }),
    }).catch((err) => console.error("Analytics error:", err));
  }, [pathname]);

  return null;
}
