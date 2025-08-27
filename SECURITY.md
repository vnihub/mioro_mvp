# Security Plan: Mioro MVP

This document outlines the security considerations and best practices for the Mioro application. Security is a critical aspect of our platform, and this document serves as a living reference for our security posture.

## 1. Authentication & Session Management

- **Password Hashing:** All merchant passwords are required to be hashed using `bcrypt`, a strong, adaptive hashing algorithm. Plain-text passwords are never stored.
- **Session Encryption:** We use `iron-session` to manage user sessions. Session data is encrypted and stored in a client-side cookie. The encryption key (`SESSION_SECRET`) is a high-entropy secret stored securely in an environment variable and is not exposed to the frontend.
- **Password Recovery:** The password recovery mechanism will use secure, single-use, time-sensitive tokens. These tokens will be sent to the user's registered email address and will expire after a short period (e.g., 1 hour) to minimize the risk of misuse. Once a token is used, it will be invalidated.
- **Brute-force Protection:** (Future) Implement rate limiting on login, registration, and password reset endpoints to mitigate brute-force and credential stuffing attacks.

## 2. Authorization & Access Control

- **Merchant Data Isolation:** The backend API strictly enforces that a logged-in merchant can only access and modify data associated with their own `merchant_id` and `shop_id`. All database queries for sensitive data are scoped to the currently authenticated user.
- **Admin Roles:** (Future) When an admin dashboard is developed, it will feature a Role-Based Access Control (RBAC) system. Different roles (e.g., `moderator`, `superadmin`) will have different levels of permissions.

## 3. Input Validation & Sanitization

- **SQL Injection Prevention:** The application exclusively uses parameterized queries via the `pg` library. This is the industry-standard defense against SQL injection attacks, as it separates the query logic from the data.
- **Cross-Site Scripting (XSS) Prevention:** We rely on the built-in XSS protection provided by React and Next.js, which automatically sanitizes data rendered on the page. We will avoid using `dangerouslySetInnerHTML` or similar methods that could bypass these protections.
- **File Upload Validation:** All file uploads (logos, store images) must be validated on the backend to ensure they are of the expected file type (e.g., `image/png`, `image/jpeg`) and within a reasonable size limit to prevent denial-of-service attacks.

## 4. Data Protection & Privacy

- **Handling of Sensitive Data:** Personally Identifiable Information (PII) and other sensitive data (e.g., Tax IDs) will be handled with extreme care. We will avoid logging sensitive information in production environments.
- **Data Privacy Compliance:** (Future) As the platform grows, we will review and implement necessary measures to comply with relevant data privacy regulations like GDPR, including creating a public privacy policy and providing mechanisms for users to manage their data.

## 5. Infrastructure & Deployment Security

- **Secret Management:** All secrets, including database connection strings, API keys, and the session secret, are managed through environment variables using a `.env` file. The `.env` file is included in `.gitignore` and will never be committed to version control.
- **HTTPS:** The application will be deployed on a platform (e.g., Vercel) that enforces HTTPS, ensuring all communication between clients and the server is encrypted.
