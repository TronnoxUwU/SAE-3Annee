"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Topbar from "@/components/Topbar.jsx";
import Style from "../styles/user.module.css";

export default function ProjetsPage() {


    return (
        <>
            <Topbar/>
            <div className={Style.userPage}>
                <h1>Ma Structure</h1>
                <div className={Style.conteneur}>
                    <a href="structure/projets" className={Style.card}>
                        <img src="/images/default-article.png" alt="Article" />
                        <h2>Mes Articles</h2>
                    </a>
                    <a className={Style.card}>
                        <img src="/images/localisation.png" alt="Project" />
                        <h2>Mes Localisations</h2>
                    </a>

                </div>
            </div>
        </>
    );
}

