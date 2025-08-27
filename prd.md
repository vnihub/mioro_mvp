# Project Requirements Document: Mioro MVP

This document outlines the project requirements for the Mioro MVP (Minimum Viable Product) application.

## 1. Introduction

Mioro is a web application that connects individuals looking to sell precious metals with local and national shops that buy them. The platform provides price transparency, allowing users to compare offers and find the best prices in their area.

## 2. User Stories

### 2.1. Public User

- As a public user, I want to be able to calculate the estimated payout for my precious metals (gold, silver, platinum) based on weight and purity.
- As a public user, I want to be able to see a list of shops in my city that buy precious metals, along with their estimated payouts.
- As a public user, I want to be able to view the details of a shop, including their contact information, address, and prices.
- As a public user, I want to be able to select a region and then a city to see the shops in that city.
- As a public user, I want the capital city of a region to be automatically selected when I select a region.

### 2.2. Merchant User

- As a new merchant, I want to be able to register for an account using my email and password.
- As a merchant, I want a combined Login/Register page for easy access.
- As a merchant who has forgotten their password, I want to be able to request a password reset link to be sent to my registered email address.
- As a merchant, after requesting a password reset, I want to receive an email with a secure, time-sensitive link to a page where I can set a new password.
- As a merchant, I want to be able to securely set a new password for my account.
- As a merchant, upon registration, I want an empty shop profile to be created for me automatically, but kept inactive (invisible to the public).
- As a logged-in merchant, I want to be redirected to my profile page, which should be the main hub for managing my shop.
- As a merchant, I want to be able to edit all my shop's details from my profile page, including its name, address, contact info, and description.
- As a merchant, I want to have a clear and simple way to activate or deactivate my shop's visibility in public search results (e.g., for vacations).
- As a merchant, I want the navigation in my dashboard to be logically ordered, with "Perfil" (Profile) appearing before "Precios" (Prices).
- As a merchant, I want to be able to manage my shop's prices for scrap and bullion products on a separate page.

### 2.3. International User

- As an international user, I want to be able to select my country from a list of supported countries to see relevant shops and regions.
- As a user in a multilingual country (e.g., India, China), I want to be able to switch the language of the user interface independently of the country I have selected.

## 3. Technical Requirements

- The application must be a full-stack web application built with Next.js.
- The frontend must be built with React and Next.js App Router.
- The backend must be built with Next.js API Routes.
- The database must be a PostgreSQL database.
- The application must provide secure authentication for merchant users.
- The application must handle image uploads for shop logos and store images.

## 5. Go-to-Market Strategy

### 5.1. Pre-Launch Phase

- **Objective:** Build a list of interested merchants and populate the platform with initial shops and prices before the public launch.
- **Key Actions:**
    - Develop a "Coming Soon" landing page with a clear value proposition and an email signup form for merchants.
    - Offer incentives for early sign-ups (e.g., "Founding Member" badge, premium placement).
    - Conduct direct outreach to a curated list of precious metal buyers in key cities.
    - Grant exclusive early access to a small group of "Founding Member" shops to gather feedback and ensure the platform is populated on day one.

### 5.2. Launch Day & Post-Launch

- **Objective:** Drive both merchant and public user adoption.
- **Key Actions:**
    - Announce the public launch via an email blast to all pre-registered merchants.
    - Switch the homepage from the "Coming Soon" page to the full application.
    - Begin targeted online marketing campaigns (e.g., Google/Facebook Ads).
    - Conduct PR outreach to local news and financial bloggers.
