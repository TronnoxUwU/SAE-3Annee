# SAE-3Annee — Annuaire culturel Bourges 2028

Projet réalisé dans le cadre d’une **SAE (Situation d’Apprentissage et d’Évaluation)** du **BUT Informatique – 3e année (2025–2026)** à l’IUT d’Orléans.

Ce projet est mené pour un **client réel**, l’association **Bourges 2028**, dans le cadre de la préparation de la Capitale Européenne de la Culture 2028.

---

## 🎯 Objectif du projet

Développer une **application web** permettant de :

- recenser les **acteurs culturels** de la région **Centre-Val de Loire**,
- les afficher dans un **annuaire** et sur une **carte interactive**,
- faciliter la **mise en relation** entre structures culturelles,
- permettre aux acteurs de gérer leurs **structures, projets et contenus** via une interface dédiée.

Le projet s’est recentré exclusivement sur les **acteurs culturels**, les structures écologiques étant redirigées vers le site de l’Écothèque.

---

## 🧑‍🤝‍🧑 Équipe

- **Baptiste Richard** — Chef de projet, développeur, responsable base de données  
- **Shanka Clermont** — Développeur, responsable production  
- **Tristan Chaloine** — Développeur  

---

## 🛠️ Stack technique

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?logo=mysql&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-Map-199900?logo=leaflet&logoColor=white)
![OpenStreetMap](https://img.shields.io/badge/OpenStreetMap-OSM-7EBC6F?logo=openstreetmap&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap&logoColor=white)
![NextAuth](https://img.shields.io/badge/Auth-NextAuth-000000)
![JWT](https://img.shields.io/badge/Auth-JWT-black?logo=jsonwebtokens)
![Docker](https://img.shields.io/badge/Docker-Deployment-2496ED?logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/CI-GitHub_Actions-2088FF?logo=githubactions&logoColor=white)

---

## 🧩 Fonctionnalités principales

### 🌍 Côté public

- Carte interactive de la région (OpenStreetMap / Leaflet)
- Annuaire des structures et projets culturels
- Recherche et filtrage par catégories
- Pages publiques des structures et projets
- Consultation des articles et réalisations

### 🔐 Authentification

- Inscription et connexion des utilisateurs
- Gestion des rôles (visiteur, acteur, administrateur)
- Sécurisation par JWT / NextAuth

### 🏗️ Côté acteur

- Création et gestion de structures
- Ajout et édition de projets / réalisations
- Rédaction d’articles via un éditeur personnalisé
- Accès à un tableau de bord dédié

### 🛠️ Administration

- Validation des structures et contenus
- Gestion des utilisateurs
- CRUD des catégories
- Tableau de bord avec statistiques

---

## 🚀 Lancer le projet

### Développement

```bash
npm run dev
```

### Build production

```bash
npm run build
npm run start
```

> ⚠️ Les variables d’environnement (BDD, authentification, mails) doivent être configurées dans un fichier `.env` telle que :
> ```env
> DATABASE_URL=
> 
> NEXTAUTH_SECRET=
> NEXTAUTH_URL=
> 
> NEXT_PUBLIC_APP_URL=
> NEXT_PUBLIC_API_URL=
> 
> 
> MAIL_HOST=
> MAIL_PORT=
> MAIL_USER=
> MAIL_PASS=
> MAIL_FROM=
> ```

---

## 🌐 Déploiement

- Build et image Docker générés via la branche `production`
- Déploiement de test effectué sur un serveur personnel (OVH)
- Base de données hébergée séparément

🔗 **Démo (environnement de test)**  
http://bourges28.shankaclermont.fr/

---

## 📚 Contexte pédagogique

Projet réalisé dans le cadre du **BUT Informatique – 3e année**, visant à :

- travailler sur un projet long avec un client réel ;
- concevoir une application web full-stack moderne ;
- appliquer une méthodologie de travail collaborative (Git Flow, CI/CD, revues de code).

---

## 📄 Licence

Projet académique — tous droits réservés à l’équipe et au client **Bourges 2028**.
