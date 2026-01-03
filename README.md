# **Casino Affiliate Platform \- Project Documentation**

## **1\. Project Overview**

This is a high-performance casino affiliate website built using **Astro**, designed to be fast, SEO-friendly, and easy to manage. It features geo-targeted content serving, a file-based CMS (Decap CMS) for content management, and component-based UI architecture.

**Key Technologies:**

* **Framework:** [Astro](https://astro.build/)  
* **Content Management:** [Decap CMS](https://decapcms.org/) (formerly Netlify CMS)  
* **Styling:** Native CSS with extensive use of CSS variables (Custom Properties)  
* **Deployment:** GitHub Actions (CI/CD)

## **2\. Getting Started**

### **Prerequisites**

* Node.js (v18.0.0 or higher recommended)  
* npm (Node Package Manager)

### **Installation**

**Clone the repository:**  
git clone \[https://github.com/nwaagency/nwaagency.github.io.git\](https://github.com/nwaagency/nwaagency.github.io.git)  
cd nwaagency.github.io/casino-platform

1. 

**Install dependencies:**  
npm install

2. 

**Start the development server:**  
npm run dev

3. The site will be available at `http://localhost:4321`.

### **Build Scripts**

* `npm run dev`: Starts local dev server with hot module replacement.  
* `npm run build`: Builds the production site to the `dist/` folder.  
* `npm run preview`: Previews the built production site locally.

## **3\. Project Structure**
```
casino-platform/  
├── .github/workflows/   \# CI/CD configurations for deployment  
├── public/              \# Static assets (images, uploads, admin config)  
│   ├── admin/           \# Decap CMS configuration and HTML  
│   └── uploads/         \# User-uploaded images (logos, icons)  
├── src/  
│   ├── components/      \# Reusable UI components (CasinoCard.astro)  
│   ├── content/         \# Content Collections (Markdown data sources)  
│   │   └── casinos/     \# Individual casino Markdown files  
│   ├── layouts/         \# Page wrappers (Layout.astro)  
│   ├── pages/           \# Route definitions  
│   │   ├── [geo]/       \# Dynamic routing for geo-targeted pages  
│   │   └── index.astro  \# Homepage  
│   └── styles/          \# Global CSS files  
└── astro.config.mjs     \# Astro configuration file
```
## **4\. Content Management**

This project uses **Content Collections** in Astro to manage casino data. You can manage content in two ways:

1. **Via Code:** Editing Markdown (`.md`) files in `src/content/casinos/`.  
2. **Via CMS:** Accessing the `/admin` dashboard (if configured locally or deployed).

### **Casino Schema (Frontmatter)**

Each casino file (e.g., `sample-casino.md`) requires specific metadata in the frontmatter block. This is defined in `src/content/config.ts`.

| Field | Type | Description |
| ----- | ----- | ----- |
| `title` | String | Name of the Casino. |
| `description` | String | Brief SEO description. |
| `thumb` | String | Path to casino logo (e.g., `/uploads/logo.png`). |
| `rating` | Number | Score out of 5 (e.g., 4.5). |
| `badges` | List | Labels like "New", "Hot", "Exclusive". |
| `bonuses` | List | List of bonus offers (Welcome Bonus, Free Spins). |
| `pros` | List | List of positive features. |
| `cons` | List | List of negative aspects. |
| `paymentMethods` | List | List of supported payment providers. |
| `gameProviders` | List | List of software providers. |
| `termsUrl` | String | Link to terms and conditions. |
| `playUrl` | String | Affiliate tracking link. |
| `geo` | String | Geo-code for targeting (e.g., 'UK', 'DE', 'Global'). |

**Example Frontmatter:**
```
\---  
title: "Royal Spin Casino"  
description: "A royal experience with massive jackpots."  
thumb: "/uploads/royal-logo.png"  
rating: 4.8  
badges: \["Exclusive", "Fast Payout"\]  
geo: "UK"  
playUrl: "\[https://affiliate-link.com/royal\](https://affiliate-link.com/royal)"  
bonuses:  
  \- "100% up to $500"  
  \- "50 Free Spins"  
paymentMethods: \["Visa", "Bitcoin"\]  
gameProviders: \["NetEnt", "Evolution"\]  
\---
```
## **5\. Routing & Geo-Targeting**

The platform uses **Dynamic Routing** to serve content specific to different geographic regions.

* **Homepage (`/`)**: Redirects or shows a default selection (defined in `src/pages/index.astro`).  
* **Geo Pages (`/[geo]/`)**: Defined in `src/pages/[geo]/index.astro`.  
  * The file uses `getStaticPaths` (if SSG) or server-side logic to determine valid `geo` slugs.  
  * It filters the `casinos` content collection to show only casinos matching the requested region.

**How it works:** If a user visits `/uk/`, the page logic inside `src/pages/[geo]/index.astro`:

1. Captures `uk` as the `geo` parameter.  
2. Queries the Content Collection.  
3. Filters casinos where `data.geo` equals `'UK'` (or is included in a geo list).  
4. Renders the list using the `CasinoCard` component.

## **6\. Components**

### **`CasinoCard.astro`**

The primary UI component for displaying a casino listing.

* **Props:** Accepts a `casino` object (from the Content Collection).  
* **Features:**  
  * Renders the casino logo and rating stars.  
  * Displays badges dynamically.  
  * Lists bonuses and features.  
  * Includes a "Play Now" CTA button linked to `playUrl`.  
  * Toggleable "Terms & Conditions" section.

### **`Layout.astro`**

The main shell of the application.

* Handles `<head>` meta tags (SEO, viewport).  
* Imports `global.css`.  
* Wraps all page content in a consistent `main` container.

## **7\. Deployment**

The project is configured for automated deployment via GitHub Actions.

* **Workflow File:** `.github/workflows/deploy.yml`  
* **Trigger:** Pushes to the `main` branch.  
* **Process:**  
  1. Checks out code.  
  2. Installs Node.js dependencies.  
  3. Runs `npm run build`.  
  4. Deploys the `dist/` folder to GitHub Pages (or the configured target).

### **CMS Configuration (`public/admin/config.yml`)**

The CMS is configured to store images in `public/uploads` and create Markdown files in `src/content/casinos`. When you save content in the CMS, it commits directly to the GitHub repository, triggering a new build and deployment.
