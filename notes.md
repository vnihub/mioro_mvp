# Post-MVP Adaptations and Future Development

This document outlines features, improvements, and refactorings to consider after the MVP is complete and the project moves towards a full version.

## 1. Localization (Country & Language Switching)
- **Vision:** The feature is not just about translating UI text. It is a full localization system where users can select their country. This will filter all data (cities, shops) to that country and change the UI to that country's primary language.
- **Current State:** Hardcoded Spanish strings and data. No localization framework in place.
- **High-Level Plan:**
    1.  **Internationalized Routing:** Use Next.js's App Router with a `[locale]` dynamic segment (e.g., `/es/...`, `/it/...`). A `middleware.ts` file will handle locale detection and redirection.
    2.  **UI Translation:** Use `next-intl` to manage UI strings. Create JSON files for each language (`es.json`, `it.json`, etc.) and replace hardcoded text.
    3.  **Data Localization:** Modify all database queries and API endpoints to be "locale-aware," filtering content based on the active country code.
    4.  **UI Component:** Build a country/language switcher component (e.g., a dropdown in the header) to allow users to change their locale.
- **Benefit:** Creates a truly international platform that can scale to new countries and markets, providing a native experience for all users.

## 2. Phone Number Validation
- **Current State:** Basic presence check and format validation for Spanish numbers on both frontend and backend.
- **Adaptation:** Implement robust phone number format validation on both frontend and backend, especially for international numbers.
- **Benefit:** Improved data quality and user experience.

## 3. Email Deliverability Verification
- **Current State:** Only format validation is in place. The system does not check if an email address actually exists.
- **Adaptation:** Implement a verification system, likely by sending a confirmation email with a unique link that the user must click.
- **Benefit:** Ensures merchants provide a valid, working email address, improving data quality and enabling reliable communication.

## 4. Admin Dashboard & Content Moderation
- **Current State:** No admin interface. Merchants are approved via script. No content moderation.
- **Adaptation:** Develop an admin panel for:
    - Merchant approval/rejection.
    - Shop management (editing details, deactivating).
    - Price oversight and moderation.
    - User reporting/flagging of content.
- **Benefit:** Platform trust, security, and operational efficiency.

## 7. Enhanced Error Handling & Logging
- **Status:** In Progress.
- **Completed:**
    - Replaced technical error messages on the merchant-facing pages (Profile, Prices) with user-friendly, generic messages.
- **Adaptation:** Implement centralized error logging (e.g., Sentry, LogRocket).
- **Benefit:** Improved debugging, better user experience during errors.

## 8. UI/UX Refinements
- **Status:** In Progress.
- **Completed:**
    - Added loading skeletons to the Merchant Profile and Prices pages for a smoother loading experience.
- **Adaptation:** Add empty states, sorting/filtering options for search results, and general polish.

## 9. User Accounts & Features
- **Current State:** No public user accounts.
- **Adaptation:** Allow public users to register, save favorite shops, receive notifications, etc.
- **Benefit:** Increased user engagement and retention.

---
# Future AI-Powered Features

This section outlines high-impact, AI-driven features to transform the platform into an intelligent market advisor, addressing core user pain points.

### Core User Pain Points
1.  **Information Asymmetry (The Seller's Problem):** Sellers often lack the expertise to identify their items' true value, weight, or purity, leading to anxiety and mistrust.
2.  **Market Volatility & Risk (The Merchant's Problem):** Merchants must constantly balance competitive pricing with the risk of fluctuating market values.

### Shortlist of High-Impact AI Features

#### 1. The AI Valuator: "Your Pocket Gemologist"
- **Pain Point Solved:** Directly combats the seller's fear of the unknown and builds immediate trust.
- **How It Works:** A user points their camera at an item.
    - **Computer Vision:** The AI identifies the object (e.g., ring, coin), reads hallmarks (e.g., "14K", "925"), and assesses key visual features.
    - **Data Synthesis & Generative AI:** The AI combines visual data with market prices and typical item weights to generate an instant, easy-to-understand valuation summary and price estimate.
- **Strategic Value:** Empowers users with transparent information, establishing Mioro as a trusted authority and creating a "killer feature" for user acquisition.

#### 2. The Market Forecaster: "Intelligent Pricing & Timing"
- **Pain Point Solved:** Reduces market timing anxiety for sellers and mitigates price volatility risk for merchants.
- **How It Works:**
    - **For Sellers:** A simple dashboard uses time-series forecasting to provide plain-language advice on whether to "Sell Now" or "Wait" based on predicted market trends.
    - **For Merchants:** An advanced tool suggests optimal buy prices by analyzing spot price volatility, competitor pricing, and the merchant's configured profit margin.
- **Strategic Value:** Transforms Mioro from a static list into a dynamic market intelligence tool, creating a daily-use habit for merchants and empowering sellers.

#### 3. The Trust & Matchmaking Engine
- **Pain Point Solved:** Addresses the seller's need for trust and safety, while helping reputable merchants stand out beyond just having the lowest price.
- **How It Works:**
    - **NLP on Reviews:** AI analyzes thousands of reviews from Mioro and public sources to identify nuanced strengths (e.g., "great for beginners," "expert in vintage coins").
    - **AI-Generated Summary:** Each shop profile includes a verified summary of its reputation and specialties.
    - **Intelligent Matchmaking:** The platform recommends the "best shop for *you*," considering factors like the item being sold and the seller's needs, not just the highest price.
- **Strategic Value:** Builds a deep, defensible moat based on trust. Competitors can copy a price list, but not this nuanced understanding of the market, making Mioro the safest and most reliable platform.
