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

## 7. Launch Plan

To address the "chicken and egg" problem of needing shops to attract users and users to attract shops, we will adopt a phased launch strategy.

- **Phase 1: Pre-Launch (Merchant Acquisition):**
    - A "Coming Soon" landing page will be deployed to capture interest from merchants.
    - Direct outreach will be conducted to a targeted list of shops.
    - A small group of "Founding Members" will be granted early access to populate the platform with their pricing information.

- **Phase 2: Public Launch:**
    - The full application will be made public.
    - An email announcement will be sent to all pre-registered merchants.
    - Targeted marketing and PR efforts will begin to attract public users.
