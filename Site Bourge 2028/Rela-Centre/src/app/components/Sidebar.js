"use client";
import { useState } from "react";
import "../styles/Sidebar.css";

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <div className={`sidebar ${open ? "" : "collapsed"}`}>
      <div className="sidebar-header">
        {open && <span>Menu</span>}
        <button onClick={() => setOpen(!open)}>
          {open ? "<" : ">"}
        </button>
      </div>
      <ul>
        <li>{open ? "Texte1" : "T1"}</li>
        <li>{open ? "Texte2" : "T2"}</li>
        <li>{open ? "Texte3" : "T3"}</li>
      </ul>
    </div>
  );
}
