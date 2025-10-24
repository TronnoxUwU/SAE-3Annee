"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Topbar from "@/components/Topbar.jsx";
import Style from "../styles/user.module.css";

export default function ProjetsPage() {

    const redirectProjet = () => {
        return () => {
            window.location.href = "/user/projets";
        };
    }

    return (
        <>
            <Topbar/>
            <div className={Style.userPage}>
                <h1>Ma Structure</h1>
                <div className={Style.conteneur}>
                    <div className={Style.card} onClick={redirectProjet()}>
                        <img src="article-image.jpg" alt="Article" />
                        <h2>Mes Articles</h2>
                    </div>
                    <div className={Style.card}>
                        <img src="project-image.jpg" alt="Project" />
                        <h2>Mes Localisations</h2>
                    </div>

                </div>
            </div>
        </>
    );
}

