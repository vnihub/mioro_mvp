# Project Tasks

This file tracks the tasks for the Mioro MVP project.

## Completed Tasks

- [x] Implement hierarchical search with regions and cities. (2025-08-25)
- [x] Translate regions to Spanish. (2025-08-25)
- [x] Automatically select the capital city of a region. (2025-08-25)
- [x] Replace the "Metal" dropdown with clickable squares. (2025-08-25)
- [x] Create `prd.md`, `gemini.md`, `planning.md`, and `tasks.md` files. (2025-08-25)
- [x] Fix console error for missing logos on home page. (2025-08-25)
- [x] Implement gray logo placeholder on shop's page. (2025-08-25)
- [x] Frontend: Translate remaining English words to Spanish. (2025-08-25)
- [x] Backend: Translate remaining English words to Spanish. (2025-08-25)
- [x] Backend: Allow merchants to set their opening hours. (2025-08-25)
- [x] Frontend: Allow merchants to set their opening hours. (2025-08-25)
- [x] Fix opening hours rendering bug on shop page. (2025-08-26)
- [x] Allow merchants to mark days as closed. (2025-08-26)
- [x] Frontend: Add a top menu. (2025-08-26)
- [x] Frontend: Add a footer. (2025-08-26)
- [x] Frontend: Add login/create account for merchants. (2025-08-26)
- [x] Implement robust phone number format validation. (2025-08-26)
- [x] Add empty states, sorting/filtering options for search results, and general polish. (2025-08-26)
- [x] Fix opening hours input bug on merchant profile page. (2025-08-26)
- [x] Fix opening hours rendering bug on shop page (again). (2025-08-26)
- [x] Add shop description feature. (2025-08-26)
- [x] Fix "Failed to fetch shop data" error on shop page. (2025-08-26)
- [x] Fix data fetching issues on home page, merchant profile, and merchant prices pages. (2025-08-26)
- [x] Fix build error on home page. (2025-08-26)
- [x] Fix data fetching issues after description implementation. (2025-08-26)
- [x] Fix login issue after re-seeding the database. (2025-08-26)
- [x] Fix issue with saving new bullion prices. (2025-08-26)
- [x] Fix data inconsistency between shop page and merchant prices page. (2025-08-26)
- [x] Fix bullion price discrepancy and duplication on shop page. (2025-08-26)
- [x] Fix critical bug preventing new bullion prices from being saved. (2025-08-26)

### Milestone 2: Merchant Account Management

- [x] Combine Login and Register pages into a single, user-friendly flow. (2025-08-26)
- [x] Reorder merchant dashboard navigation to place "Perfil" before "Precios". (2025-08-26)
- [x] Create a new merchant registration API endpoint (`/api/auth/register`). (2025-08-26)
- [x] Implement logic to create new merchant, user, and an inactive shop upon registration. (2025-08-26)
- [x] Develop the frontend for the merchant profile page to allow editing of all shop details. (2025-08-26)
- [x] Implement the backend (`PUT /api/merchant/profile`) to handle profile updates. (2025-08-26)
- [x] Add a shop activation/deactivation toggle on the profile page to control public visibility. (2025-08-26)

## Recent Fixes (2025-08-27)
- [x] Fix API: Update price_eur to price in /api/cities/[city_id]/shops. (2025-08-27)
- [x] Fix API: Update price_eur to price in /api/shops/[id]. (2025-08-27)
- [x] Fix Frontend: Update price_eur to price in src/app/shop/[id]/page.tsx. (2025-08-27)
- [x] Fix Frontend: Restore and fix main page search functionality. (2025-08-27)

## Future Tasks

### Milestone 3: Core Functionality Enhancements

- [ ] Implement email deliverability verification.
- [ ] Implement password recovery flow for merchants.

### Milestone 4: New Features

- [ ] Implement localization (Country & Language Switching).
- [ ] Develop an admin dashboard for content moderation.

### Milestone 5: AI-Powered Features

- [ ] Implement the AI Valuator ("Your Pocket Gemologist").
- [ ] Implement the Market Forecaster ("Intelligent Pricing & Timing").
- [ ] Implement the Trust & Matchmaking Engine.

### Milestone 6: Location Management

- [ ] Enhance merchant profile page to allow setting/changing the shop's region and city.
- [ ] Modify the city dropdown on the home page to only show cities that have active shops.
- [ ] Create a script to pre-populate the `cities` table with a comprehensive list of cities for Spain using a public dataset.
