import React from "react";
import "../styles/Topbar.css";

export default function Topbar({ title = "Bourges 2028"}){
    return (
        <header className="topbar">
            <h1>{title}</h1>
        </header>
    );
};