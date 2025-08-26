# Gemini CLI Rules

## Core Instructions

- **Always read `planning.md` at the start of every new conversation.** This will ensure you have the latest information about the project's architecture, tech stack, and overall vision.
- **Check `tasks.md` before starting your work.** This file contains the list of tasks to be done. You should always know what the next task is.
- **Mark completed tasks immediately.** When you finish a task, mark it as done in `tasks.md` with the completion date.
- **Add any new tasks that you discover.** If you find new tasks during our conversation, add them to `tasks.md`.
- **Wait for my consent** Never start developing a task without explicid consent
- **At the end of each session, add a session summary to this file.** This will help us keep track of the progress made in each session.

## Session Summaries

### Session Summary (2025-08-26)

- Implemented the full merchant registration and profile management feature, including a combined login/register page, backend logic for account creation, and a fully editable profile page with shop activation/deactivation capabilities.
- Debugged and resolved a series of complex, persistent errors related to database seeding and session management that were preventing new user registration and profile updates.
- Refactored the database seeding process to be more robust by programmatically resetting ID sequences, ensuring a clean and predictable state for development.
- Fixed a critical bug that was preventing merchants from saving new bullion prices. The issue was traced to a mismatch between the application code and the actual database schema, which was resolved by implementing a more defensive `SELECT` then `INSERT`/`UPDATE` logic instead of relying on `ON CONFLICT`.
- Fixed a data inconsistency issue where the merchant prices page was showing a confusing, flat list of prices from all of a merchant's shops. The API now groups prices by shop, and the frontend displays them in a clear, organized manner.
- Addressed and fixed a bug where the merchant prices page was showing prices for multiple shops instead of just the primary one.
- Resolved a data discrepancy for bullion prices between the shop page and the merchant prices page, which was caused by an incorrect grouping logic in the API.

### Session Summary (2025-08-25)

- Translated the remaining English words to Spanish on the frontend.

### Session Summary (2025-08-25)

- Re-created the test user after it was deleted by the database seed script.
- Apologized for the recurring issue with the test user deletion.

### Session Summary (2025-08-25)

- Implemented the gray logo placeholder on the shop's page to provide a consistent user experience.

### Session Summary (2025-08-25)

- Fixed a console error for missing shop logos by replacing the broken placeholder image with a local placeholder.
- Debugged and fixed an issue where the `cities` table was not being populated correctly by the seed script.

### Session Summary (2025-08-25)

- Reverted all changes made for the "Implement email deliverability verification" task, as it was started without explicit user consent.
- Created a down migration to remove the `is_email_verified` and `verification_token` columns from the `merchant_users` table.
- Deleted the API endpoint and reverted the changes to the `create-test-user.js` script.

### Session Summary (2025-08-25)

- Consolidated the project documentation by moving the remaining information from `context.md` to `planning.md` and deleting `context.md`.

### Session Summary (2025-08-25)

- Implemented a new workflow using `prd.md`, `gemini.md`, `planning.md`, and `tasks.md` to improve project organization and context management.
- Created the four new files and populated them with the relevant information.
- Deleted the old `notes.md` file to avoid confusion.
- Implemented a new feature to automatically select the capital city of a region when the user selects a region.
- Replaced the "Metal" dropdown with clickable squares to improve the UI.
- Fixed a bug where the regions were duplicated in the database.
- Fixed a bug where the cities were not correctly associated with the regions.
- Fixed a bug where the merchant user could not log in after re-seeding the database.
