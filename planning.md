# Project Planning: Mioro MVP

This document outlines the project's vision, architecture, technology stack, and future development plans.

## 1. Project Vision

Mioro aims to be a platform connecting individuals looking to sell precious metals (gold, silver, platinum) with local and national companies/shops that buy these metals. The core value proposition is price transparency, allowing users to compare offers and find the best prices in their area.

## 2. Architecture

The application is a full-stack web application built with Next.js.

- **Frontend:** The frontend is built with React and Next.js App Router. It uses Tailwind CSS for styling.
- **Backend:** The backend is built with Next.js API Routes.
- **Database:** The database is a PostgreSQL database, managed with Docker for local development.

## 3. Technology Stack

- **Frontend:** React, Next.js, Tailwind CSS
- **Backend:** Next.js API Routes, Node.js
- **Database:** PostgreSQL, `pg` (Node.js client)
- **Authentication:** `iron-session`, `bcryptjs`
- **Image Processing:** `sharp`
- **File Uploads:** `fs/promises`, `path` (Node.js built-in modules)

## 4. Known Issues & Workarounds

- **Tailwind Custom Colors:** Custom colors defined in `tailwind.config.ts` are not being picked up by the build system. A workaround using CSS variables (`var(--color-primary)`) is implemented in `globals.css` and used directly in components.

## 5. Deployment

For deployment, Vercel is the recommended platform due to its seamless integration with Next.js. A production-ready PostgreSQL database (e.g., Vercel Postgres) would be required.

### 5.1. Development & Deployment Workflow

To ensure the stability of the live application, we will adopt a Git Flow branching strategy. This workflow isolates development from production, protecting live user data and providing a clear path for testing and releasing new features.

- **`main` Branch (Production):** This branch contains the live, stable code. It is only updated by merging from `release` or `hotfix` branches. The live application is deployed from here.
- **`develop` Branch (Staging):** This is the primary development branch. All new feature branches are merged into `develop`. This branch will be deployed to a separate staging environment, connected to a test database, for thorough testing before release.
- **Feature Branches:** All new features are built on their own branches (e.g., `feature/new-feature`). This keeps development isolated and organized.
- **Reverting:** If a production release causes issues, we can safely revert the changes on the `main` branch using `git revert`.

## 6. Security

A detailed security plan outlining our commitment to protecting user data and ensuring platform integrity is documented in the `SECURITY.md` file.

## 8. Localization Strategy

To support international expansion, the application will be architected to handle multiple countries and languages. The core principle is the separation of country and language.

- **Country Selection:** This will be the primary data filter. Selecting a country will determine which shops, regions, and cities are displayed.
- **Language Selection:** This will control the UI language. A user can be browsing shops in India, for example, but have the UI displayed in English or Spanish.

### UI/UX Design Principles for Localization

To avoid user confusion, the UI will adhere to the following design principles:

- **Flags for Countries Only:** Flags will be used exclusively to represent countries in the country selector.
- **Text for Languages:** The language selector will be text-based and will not use flags. The name of each language will be displayed in its own language (e.g., "Español", "English", "Català") to ensure clarity for all users.

### Intelligent Language Handling

To provide a superior user experience, the localization will include the following intelligent features:

- **Persistence:** The user's country and language selections will be saved locally in their browser (e.g., using `localStorage`). On subsequent visits, the application will automatically apply their last-used settings, providing a seamless experience.
- **Context-Aware Language Switching:** The list of available languages will be dynamically prioritized based on the selected country. For example, selecting "Spain" will show Spanish and other regional languages first, while selecting "India" will prioritize English and Hindi.
- **Guaranteed English Fallback:** English will always be available as a language option, regardless of the selected country. In non-English speaking countries, it will appear at the end of the prioritized list, serving as a universal fallback.
