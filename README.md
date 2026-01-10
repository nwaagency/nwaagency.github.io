# **Casino Platform Technical Documentation**

**Version:** 0.0.1

**Last Updated:** 2026-01-11

**Status:** Alpha / Development

## **1\. System Architecture**

The Casino Platform is built on a **JAMstack** architecture, leveraging **Astro 5.x** for high-performance static site generation (SSG) and **Decap CMS** for Git-based content management. The system operates without a runtime database; all data is stored as flat files (Markdown/JSON) within the repository, ensuring version control for both code and content.

### **1.1 Architectural Flow**

1. **Content Layer:** Editors manage content via the Decap CMS UI (/admin). Changes are committed directly to the GitHub repository.  
2. **Build Layer:** GitHub Actions detects commits, triggering a CI/CD pipeline that installs dependencies and executes the Astro build process.  
3. **Data Integration:** At build time, Astro's Content Collections API validates all data against strict Zod schemas and resolves relational references (e.g., Casinos ↔ Providers).  
4. **Presentation Layer:** Astro generates pure static HTML/CSS/JS assets.  
5. **Distribution:** The final build is deployed to GitHub Pages (or any static host), serving content via CDN.

### **1.2 Architecture Diagram**

graph TD  
    User\[Content Editor\] \--\>|Updates Content| CMS\[Decap CMS / Admin UI\]  
    CMS \--\>|Commits Markdown/JSON| Repo\[GitHub Repository\]  
    Repo \--\>|Triggers| Action\[GitHub Actions CI\]  
      
    subgraph "Build Pipeline (Astro 5.x)"  
        Action \--\>|Fetches Data| Collections\[Content Collections\]  
        Collections \--\>|Validates Schema| Zod\[Zod Validation\]  
        Zod \--\>|Generates Pages| SSG\[Static Site Generator\]  
    end  
      
    SSG \--\>|Outputs| Dist\[./dist Folder\]  
    Dist \--\>|Deploys to| Hosting\[GitHub Pages / CDN\]  
    Hosting \--\>|Serves HTML| EndUser\[Site Visitor\]

## **2\. System Components**

### **2.1 Core Technology Stack**

| Component | Technology | Purpose |
| :---- | :---- | :---- |
| **Framework** | Astro 5.x | Static Site Generation, Routing, Component Island Architecture. |
| **CMS** | Decap CMS | Git-based Headless CMS for content management. |
| **Styling** | Tailwind CSS | Utility-first CSS framework for rapid UI development. |
| **Validation** | Zod | TypeScript-first schema declaration and validation library. |
| **Runtime** | Node.js (v18+) | Development environment and build runner. |

### **2.2 Directory Structure**

/  
├── .github/workflows/    \# CI/CD pipelines (deploy.yml)  
├── public/  
│   ├── admin/            \# Decap CMS entry point (index.html, config.yml)  
│   └── uploads/          \# Media assets managed by CMS  
├── src/  
│   ├── components/       \# UI Components (CasinoCard.astro, Header.astro)  
│   ├── content/          \# Database (Flat-file storage)  
│   │   ├── banking/      \# JSON/MD files for Banking methods  
│   │   ├── casinos/      \# Markdown files for Casinos  
│   │   ├── providers/    \# JSON/MD files for Game Providers  
│   │   └── config.ts     \# Zod Schemas & Collection Definitions  
│   ├── layouts/          \# Page wrappers (Layout.astro)  
│   ├── pages/  
│   │   ├── \[geo\]/        \# Dynamic routes for Geo-targeted pages (e.g., /uk/, /nz/)  
│   │   └── index.astro   \# Homepage  
│   └── styles/           \# Global CSS (Tailwind imports)  
├── astro.config.mjs      \# Astro configuration  
└── package.json          \# Dependencies and scripts

## **3\. Functional Overview**

### **3.1 Geo-Routing Strategy**

The platform utilizes Astro's dynamic routing to generate localized pages. The file src/pages/\[geo\]/index.astro serves as the template.

* **Logic:** The getStaticPaths() function iterates through a defined list of supported regions (e.g., \['uk', 'nz', 'ca'\]).  
* **Filtering:** For each generated page (e.g., /uk), the build script filters the casinos collection to include only those where the geo array field contains the matching country code.  
* **Fallback:** If a user accesses the root /, they are typically redirected or shown a global list, depending on the logic in src/pages/index.astro.

### **3.2 Relational Data Strategy**

Although the data is flat-file, the system maintains relational integrity using **Reference Fields**.

* **Casinos** act as the primary entity.  
* **Banking** and **Providers** are lookup entities.  
* **Resolution:** In src/content/config.ts, the casino schema uses the reference() function. This ensures that a casino cannot be saved with a bank\_id that does not exist in the banking collection.

### **3.3 CI/CD Workflow**

The file .github/workflows/deploy.yml orchestrates the deployment:

1. **Trigger:** Push to main branch.  
2. **Job:** deploy.  
3. **Steps:** Checkout code → Install Node → Install Dependencies (npm ci) → Build (npm run build) → Upload Artifact → Deploy to GitHub Pages.

## **4\. Data Requirements**

All data models are strictly typed and validated at build time. Failure to adhere to these schemas will result in a build error, preventing invalid content from going live.

### **4.1 Content Collections**

#### **Collection: casinos**

* **Path:** src/content/casinos/\*.md  
* **Format:** Markdown with Frontmatter

| Field | Type | Description | Validation Rule |
| :---- | :---- | :---- | :---- |
| name | String | Brand name of the casino | Required |
| rating | Number | Review score | 0.0 \- 5.0 |
| geo | Array\<String\> | Supported countries (ISO codes) | Must not be empty |
| bonuses | Object | Nested bonus details | Required structure |
| bank\_id | Reference | Link to Banking methods | Must exist in banking collection |
| provider\_id | Reference | Link to Game Providers | Must exist in providers collection |

#### **Collection: banking**

* **Path:** src/content/banking/\*.json  
* **Format:** JSON

| Field | Type | Description |
| :---- | :---- | :---- |
| id | String | Unique slug (filename) |
| name | String | Display name (e.g., "Visa") |
| image | String | Path to icon in /public/uploads/ |

#### **Collection: providers**

* **Path:** src/content/providers/\*.json  
* **Format:** JSON

| Field | Type | Description |
| :---- | :---- | :---- |
| id | String | Unique slug (filename) |
| name | String | Display name (e.g., "NetEnt") |
| image | String | Path to logo in /public/uploads/ |

### **4.2 Data Integrity**

* **Referential Integrity:** Enforced by Astro reference(). If a Casino references visa but src/content/banking/visa.json is deleted, the build fails.  
* **Asset Integrity:** Images referenced in frontmatter strings (e.g., /uploads/logo.png) are not automatically checked by Zod but are managed via the CMS media library.

## **5\. API Reference**

### **5.1 Internal Build API (Astro)**

Developers access content using Astro's internal modules.

import { getCollection, getEntry } from 'astro:content';

// Fetch all casinos  
const allCasinos \= await getCollection('casinos');

// Fetch casinos for UK only  
const ukCasinos \= allCasinos.filter(casino \=\>   
  casino.data.geo.includes('uk')  
);

// Resolve references (example)  
const casino \= allCasinos\[0\];  
const bankingMethods \= await Promise.all(  
  casino.data.bank\_id.map(id \=\> getEntry(id))  
);

### **5.2 CMS Configuration (config.yml)**

The CMS API is configured via public/admin/config.yml.

* **Backend:** Configured for git-gateway (proxies GitHub API).  
* **Media Folder:** public/uploads.  
* **Public Path:** /uploads.  
* **Collections:** Maps the UI widgets to the file paths mentioned in Section 4.1.

## **6\. Command Reference**

All commands are run from the project root.

| Command | Description |
| :---- | :---- |
| npm run dev | Starts the local development server at http://localhost:4321. Hot Module Replacement (HMR) is active. |
| npm run build | Compiles the site for production into the dist/ directory. Validates all content schemas. |
| npm run preview | Serves the contents of the dist/ directory locally to simulate a production environment. |
| npm run astro | Access the Astro CLI directly (e.g., npm run astro add react). |

## **7\. User Guide**

### **7.1 Local Development Setup**

1. **Prerequisites:** Node.js v18.14.1 or higher, Git.  
2. **Clone Repository:**  
   git clone \[https://github.com/nwaagency/nwaagency.github.io.git\](https://github.com/nwaagency/nwaagency.github.io.git)  
   cd casino-platform

3. **Install Dependencies:**  
   npm install

4. **Start Server:**  
   npm run dev

### **7.2 Managing Content (Content Editors)**

1. Navigate to /admin on the live site (or http://localhost:4321/admin locally).  
2. Login via the configured Identity provider.  
3. **To Add a Casino:**  
   * Click **Casinos** in the left sidebar.  
   * Click **New Casino**.  
   * Fill in Name, Rating, and select Geo Regions.  
   * Use the "Relation" widgets to select Banking Methods and Providers.  
   * Click **Publish**.  
4. **Media:** Upload images directly within the content editor. They will be saved to /public/uploads.

### **7.3 Troubleshooting Common Issues**

**Issue: "Build Error: Content validation failed"**

* **Cause:** A required field is missing in a Markdown/JSON file, or a reference link is broken (e.g., a Casino points to a deleted Provider).  
* **Fix:** Check the console output for the specific filename and field. Open the file in the CMS or code editor and correct the data.

**Issue: "Images not loading"**

* **Cause:** Incorrect path in the frontmatter.  
* **Fix:** Ensure paths start with /uploads/ and the file exists in public/uploads/.

## **8\. Documentation References**

* **Astro Framework:** [https://docs.astro.build/](https://docs.astro.build/)  
* **Astro Content Collections:** [https://docs.astro.build/en/guides/content-collections/](https://docs.astro.build/en/guides/content-collections/)  
* **Decap CMS:** [https://decapcms.org/docs/intro/](https://decapcms.org/docs/intro/)  
* **Zod Validation:** [https://zod.dev/](https://zod.dev/)  
* **Tailwind CSS:** [https://tailwindcss.com/docs](https://tailwindcss.com/docs)