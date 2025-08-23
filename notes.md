# Post-MVP Adaptations and Future Development

This document outlines features, improvements, and refactorings to consider after the MVP is complete and the project moves towards a full version.

## 1. Internationalization (i18n)
- **Current State:** Hardcoded Spanish strings. No i18n library in place.
- **Adaptation:** Implement a proper i18n framework (e.g., `next-intl`) to support multiple languages (e.g., English, other European languages).
- **Benefit:** Easier translation management, scalable for global expansion.

## 2. Phone Number Validation
- **Current State:** Basic presence check and format validation for Spanish numbers on both frontend and backend.
- **Adaptation:** Implement robust phone number format validation on both frontend and backend, especially for international numbers.
- **Benefit:** Improved data quality and user experience.

## 3. Admin Dashboard & Content Moderation
- **Current State:** No admin interface. Merchants are approved via script. No content moderation.
- **Adaptation:** Develop an admin panel for:
    - Merchant approval/rejection.
    - Shop management (editing details, deactivating).
    - Price oversight and moderation.
    - User reporting/flagging of content.
- **Benefit:** Platform trust, security, and operational efficiency.

## 4. Bullion/Coin Search for Public Users
- **Current State:** Implemented. Public users can now search for bullion products by type and quantity.
- **Adaptation:** Extend the public-facing calculator and search results to include bullion products.
- **Benefit:** Completes a core feature, expands user utility.

## 5. Image Handling Improvements
- **Current State:** Logo upload saves raw image. No resizing or optimization.
- **Adaptation:** Implement server-side image processing (e.g., resizing, compression) for uploaded logos.
- **Benefit:** Better performance, consistent image quality.

## 6. Enhanced Error Handling & Logging
- **Current State:** Basic error messages. Console logging for backend errors.
- **Adaptation:** Implement centralized error logging (e.g., Sentry, LogRocket) and more user-friendly error displays.
- **Benefit:** Improved debugging, better user experience during errors.

## 7. UI/UX Refinements
- **Current State:** Functional but basic UI.
- **Adaptation:** Add loading skeletons, empty states, sorting/filtering options for search results, and general polish.
- **Benefit:** Improved perceived performance and user satisfaction.

## 8. User Accounts & Features
- **Current State:** No public user accounts.
- **Adaptation:** Allow public users to register, save favorite shops, receive notifications, etc.
- **Benefit:** Increased user engagement and retention.

## 9. Project Structure Cleanup
- **Current State:** Warning about multiple `package-lock.json` files.
- **Adaptation:** Consolidate dependencies into a single `package.json` or formalize as a monorepo (e.g., using npm workspaces).
- **Benefit:** Cleaner project, avoids potential future build/dependency issues.
