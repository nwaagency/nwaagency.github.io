/**
 * Nexora Web Agency — Portfolio Page Animations
 * File: assets/js/animations.js
 *
 * Pure CSS-transition + IntersectionObserver implementation.
 * No external dependencies.
 */

(function () {
    "use strict";

    /* ── 0. Scroll progress bar ──────────────────────────────────────────── */
    const progressBar = document.querySelector(".pf-progress");
    if (progressBar) {
        window.addEventListener("scroll", () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = progress + "%";
        }, { passive: true });
    }

    /* ── 1. Sticky nav shrink on scroll ─────────────────────────────────── */
    const nav = document.querySelector(".pf-nav");
    if (nav) {
        window.addEventListener("scroll", () => {
            nav.classList.toggle("pf-nav--scrolled", window.scrollY > 60);
        }, { passive: true });
    }

    /* ── 2. Scroll reveal (IntersectionObserver + CSS transitions) ───────── */
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("pf-visible");
                }
            });
        },
        { threshold: 0.07, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".pf-section").forEach((el) => observer.observe(el));
})();
