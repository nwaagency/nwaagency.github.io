# **Nexora Web Agency**

## **Overview**

Nexora Web Agency is a high-performance, statically generated portfolio and service website designed for a digital engineering agency. It offers a professional showcase of Web, Mobile, and Data Analytics engineering services.

The project solves the need for a lightning-fast, SEO-optimized, and highly secure digital storefront. It targets businesses and enterprise clients seeking custom digital solutions. Architecturally, the application is a pure static frontend (HTML/CSS/JS) decoupled from a traditional backend, utilizing serverless form handling for lead generation and client inquiries.

## **Tech Stack**

* **Frontend Framework:** Plain HTML5, CSS3 (Custom Properties/Variables)  
* **Scripting:** Vanilla JavaScript (ES6+)  
* **Hosting / Deployment:** Netlify (Inferred via netlify.toml)  
* **Backend / API:** Serverless Form Processing (Netlify Forms)  
* **Build Tools:** Native npm scripts (Bash copy commands)  
* **Fonts & Typography:** Google Fonts (Inter, JetBrains Mono)

## **Features**

* **Multi-Step Interactive Quoting System:** A custom 3-step lead generation form (forms.js) utilizing Vanilla JS DOM manipulation for state management, step validation, and progress tracking.  
* **Serverless Form Handling:** Forms are instrumented with data-netlify="true", allowing Netlify to automatically intercept POST requests, parse submissions, and handle spam filtering without a dedicated backend server.  
* **Scroll-Triggered Animations:** Implements the native IntersectionObserver API to orchestrate staggered, high-performance CSS reveal animations as elements enter the viewport.  
* **Interactive UI Elements:** Features custom cursor-tracking glow effects and radial gradient hover states calculated dynamically via mouse position tracking in JavaScript.  
* **Robust Security Headers:** Hardened edge delivery utilizing netlify.toml to enforce strict security headers (Clickjacking prevention, XSS blocking, and strict referrer policies).

## **Architecture**

### **Project Structure**

├── netlify.toml               \# Edge configuration, security headers, and routing rules  
├── package.json               \# Build orchestration  
├── public/                    \# Unprocessed static assets  
│   ├── icons/                 \# SVG icons and logos  
│   └── images/                \# Founder and project images  
└── src/  
    ├── assets/  
    │   ├── css/               \# Global design system, resets, and utility classes  
    │   └── js/                \# Core interactive logic (e.g., forms.js)  
    ├── components/  
    │   └── global/            \# Extracted UI components (Header.html, Footer.html)  
    └── pages/                 \# Core route pages (index, about, contact, etc.)  
        └── services/          \# Individual nested service pages

### **Application Flow**

* **Routing Logic:** File-based static routing. Requests map directly to .html files in the dist folder. Netlify handles clean URLs and 404 fallbacks.  
* **State Management:** Localized DOM state is used exclusively. The multi-step form tracks the currentStep index in memory to toggle CSS classes (.active, .completed) without full page reloads.  
* **API Communication:** No internal REST/GraphQL APIs. Data egress is handled strictly through form-encoded POST requests intercepted at the edge by Netlify.  
* **Data Flow:** Purely unidirectional UI rendering. Client interacts with DOM \-\> JS updates classes \-\> CSS handles visual transitions.

## **Installation**

### **Prerequisites**

* **Node.js**: v20.x (as strictly defined in netlify.toml)  
* **npm**: v9+ (or equivalent package manager)  
* **Static File Server**: e.g., npx serve, live-server, or http-server

### **Setup**

1. **Clone the repository**  
   git clone \<repository-url\>  
   cd nwaagency.github.io

2. **Install dependencies** *(Note: This project relies entirely on native system commands for the build, so no heavy node\_modules are required.)*  
   npm install

3. **Build the project**  
   npm run build

4. **Run development server** Since this is a static site, you can serve the compiled dist/ directory using any static server:  
   npx serve dist

### **Environment Variables**

No .env variables are strictly required for local compilation. However, netlify.toml reserves space for NODE\_VERSION="20". Any future API keys (e.g., for analytics tracking or third-party integrations) should be configured directly in the Netlify UI.

## **Available Scripts**

* npm run build: Executes a bash script that creates a dist directory, then safely copies src/pages/, src/assets/, and public/ into the distribution folder, suppressing errors if directories are empty.

## **Build & Deployment**

* **Production Build:** The production build simply structures the static assets. Run npm run build to generate the /dist folder.  
* **Deployment Process:** Continuous Deployment (CD) is assumed to be handled by Netlify via Git webhooks. Pushing to the main branch automatically triggers the build command.  
* **Hosting Compatibility:** While optimized for Netlify via netlify.toml, the output in /dist is completely platform-agnostic and can be deployed to Vercel, AWS S3, GitHub Pages, or any standard web server (Nginx/Apache).

## **Security Notes**

* **Headers Configured:** \- X-Frame-Options \= "DENY"  
  * X-Content-Type-Options \= "nosniff"  
  * X-XSS-Protection \= "1; mode=block"  
  * Referrer-Policy \= "strict-origin-when-cross-origin"  
* **Authentication:** No authentication layer is implemented. The application is entirely public-facing.  
* **Data Privacy:** Form submissions contain PII (Names, Emails, Phone numbers). Netlify Forms handles this data securely, but ensure compliance with GDPR/POPIA regarding data retention in the Netlify dashboard.

## **Contributing**

* **Branching Strategy:** Use standard feature branching (feature/your-feature-name or fix/issue-description).  
* **Code Style:** \- CSS: Utilize BEM-adjacent class naming. Rely on the variables defined in global.css for colors and spacing.  
  * JS: Use ES6 syntax, avoid global scope pollution, and wrap logic in DOMContentLoaded event listeners.

## **Improvements & Recommendations**

1. **Templating Engine Integration:** The Header.html and Footer.html snippets are currently duplicated across all .html files in src/pages/. Migrating to a lightweight Static Site Generator (SSG) like Eleventy (11ty) or Astro would DRY up the codebase and allow dynamic component inclusion.  
2. **Remove SPA Redirect Rule:** In netlify.toml, the rule from \= "/\*" to \= "/index.html" status \= 200 is designed for Single Page Applications (React/Vue). Because this is a multi-page static site, this rule can hijack legitimate 404s. It should be removed, relying solely on the defined 404 fallback.  
3. **Asset Minification:** The current build script strictly copies files. Adding tools like cssnano or terser to the build pipeline would minify CSS and JavaScript, further reducing Time to Interactive (TTI).  
4. **Local Dev Environment:** Add a local dev script to package.json utilizing a tool like browser-sync or vite to enable Hot Module Replacement (HMR) during frontend development.