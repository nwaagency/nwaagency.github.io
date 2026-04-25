/**
 * Nexora Web Agency — Portfolio Page Animations
 * File: shared/animations.js
 *
 * Dependencies (loaded before this file):
 *   https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js
 *   https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js
 *
 * Falls back gracefully if GSAP is not available (uses CSS transitions only).
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

    /* ── 2. Intersection Observer fallback (CSS-only scroll reveal) ──────── */
    // This runs regardless of GSAP so sections are always visible.
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

    /* ── 3. GSAP-enhanced animations (only if GSAP loaded) ──────────────── */
    if (typeof gsap === "undefined") {
        console.info("[Nexora animations] GSAP not loaded — using CSS transitions only.");
        // Make all sections visible immediately as fallback
        document.querySelectorAll(".pf-section").forEach((el) => el.classList.add("pf-visible"));
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    /* ── 3a. Hero entrance ─────────────────────────────────────────────── */
    const heroContent = document.querySelectorAll(".pf-hero__content > *");
    if (heroContent.length) {
        gsap.fromTo(
            heroContent,
            { y: 36, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, stagger: 0.14, ease: "power3.out", delay: 0.25 }
        );
    }

    const heroVisual = document.querySelector(".pf-hero__visual");
    if (heroVisual) {
        gsap.fromTo(
            heroVisual,
            { x: 60, opacity: 0 },
            { x: 0, opacity: 1, duration: 1.1, ease: "power3.out", delay: 0.5 }
        );
    }

    /* ── 3b. Scroll-triggered fade-up (all data-animate="fade-up") ──────── */
    document.querySelectorAll("[data-animate='fade-up']").forEach((el) => {
        gsap.fromTo(
            el,
            { y: 40, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.75, ease: "power3.out",
                scrollTrigger: { trigger: el, start: "top 88%", once: true },
            }
        );
    });

    /* ── 3c. Staggered children (data-animate="stagger") ────────────────── */
    document.querySelectorAll("[data-animate='stagger']").forEach((parent) => {
        const children = parent.children;
        gsap.fromTo(
            children,
            { y: 30, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.65, stagger: 0.1, ease: "power3.out",
                scrollTrigger: { trigger: parent, start: "top 85%", once: true },
            }
        );
    });

    /* ── 3d. Slide in from left/right ───────────────────────────────────── */
    document.querySelectorAll("[data-animate='slide-left']").forEach((el) => {
        gsap.fromTo(
            el,
            { x: -60, opacity: 0 },
            {
                x: 0, opacity: 1, duration: 0.85, ease: "power3.out",
                scrollTrigger: { trigger: el, start: "top 85%", once: true },
            }
        );
    });
    document.querySelectorAll("[data-animate='slide-right']").forEach((el) => {
        gsap.fromTo(
            el,
            { x: 60, opacity: 0 },
            {
                x: 0, opacity: 1, duration: 0.85, ease: "power3.out",
                scrollTrigger: { trigger: el, start: "top 85%", once: true },
            }
        );
    });

    /* ── 3e. Counter animation (data-count="number" data-suffix="+") ─────── */
    document.querySelectorAll("[data-count]").forEach((el) => {
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix !== undefined ? el.dataset.suffix : "+";
        const isFloat = !Number.isInteger(target);

        ScrollTrigger.create({
            trigger: el,
            start: "top 82%",
            once: true,
            onEnter: () => {
                const obj = { val: 0 };
                gsap.to(obj, {
                    val: target,
                    duration: 2.2,
                    ease: "power2.out",
                    onUpdate() {
                        el.textContent = isFloat
                            ? obj.val.toFixed(1) + suffix
                            : Math.round(obj.val) + suffix;
                    },
                    onComplete() {
                        el.textContent = (isFloat ? target.toFixed(1) : target) + suffix;
                    },
                });
            },
        });
    });

    /* ── 3f. Stats strip stagger ─────────────────────────────────────────── */
    const statsStrip = document.querySelector(".pf-stats-strip");
    if (statsStrip) {
        gsap.fromTo(
            statsStrip.children,
            { y: 20, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power3.out",
                scrollTrigger: { trigger: statsStrip, start: "top 88%", once: true },
            }
        );
    }

    /* ── 3g. Outcomes grid cards ─────────────────────────────────────────── */
    const outcomesGrid = document.querySelector(".pf-outcomes-grid");
    if (outcomesGrid) {
        gsap.fromTo(
            outcomesGrid.children,
            { y: 30, opacity: 0, scale: 0.96 },
            {
                y: 0, opacity: 1, scale: 1, duration: 0.65, stagger: 0.1, ease: "back.out(1.4)",
                scrollTrigger: { trigger: outcomesGrid, start: "top 82%", once: true },
            }
        );
    }

    /* ── 3h. Design cards stagger ────────────────────────────────────────── */
    const designGrid = document.querySelector(".pf-design-grid");
    if (designGrid) {
        gsap.fromTo(
            designGrid.children,
            { y: 24, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power3.out",
                scrollTrigger: { trigger: designGrid, start: "top 85%", once: true },
            }
        );
    }

    /* ── 3i. Process steps ───────────────────────────────────────────────── */
    const processGrid = document.querySelector(".pf-process");
    if (processGrid) {
        gsap.fromTo(
            processGrid.children,
            { y: 20, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: "power3.out",
                scrollTrigger: { trigger: processGrid, start: "top 85%", once: true },
            }
        );
    }

    /* ── 3j. Mockup parallax tilt on mouse move ─────────────────────────── */
    document.querySelectorAll(".pf-mockup").forEach((mockup) => {
        const parent = mockup.parentElement;
        parent.addEventListener("mousemove", (e) => {
            const rect = parent.getBoundingClientRect();
            const xRatio = (e.clientX - rect.left) / rect.width - 0.5;
            const yRatio = (e.clientY - rect.top) / rect.height - 0.5;
            gsap.to(mockup, {
                rotateY: xRatio * 8,
                rotateX: -yRatio * 5,
                duration: 0.6,
                ease: "power2.out",
                transformPerspective: 1000,
            });
        });
        parent.addEventListener("mouseleave", () => {
            gsap.to(mockup, { rotateY: 0, rotateX: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" });
        });
    });

    /* ── 3k. Callout box pop-in ─────────────────────────────────────────── */
    document.querySelectorAll(".pf-callout").forEach((el) => {
        gsap.fromTo(
            el,
            { scale: 0.97, opacity: 0 },
            {
                scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.6)",
                scrollTrigger: { trigger: el, start: "top 88%", once: true },
            }
        );
    });

    /* ── 3l. Testimonial fade-up ─────────────────────────────────────────── */
    const testimonial = document.querySelector(".pf-testimonial");
    if (testimonial) {
        gsap.fromTo(
            testimonial,
            { y: 30, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
                scrollTrigger: { trigger: testimonial, start: "top 85%", once: true },
            }
        );
    }

    /* ── 3m. CTA section entrance ────────────────────────────────────────── */
    const ctaSection = document.querySelector("#cta");
    if (ctaSection) {
        const ctaChildren = ctaSection.querySelectorAll(".pf-cta > *");
        gsap.fromTo(
            ctaChildren,
            { y: 30, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.75, stagger: 0.12, ease: "power3.out",
                scrollTrigger: { trigger: ctaSection, start: "top 80%", once: true },
            }
        );
    }

    /* ── 3n. Floating badge pulse on hero (optional) ─────────────────────── */
    const heroBadge = document.querySelector(".pf-hero__badge");
    if (heroBadge) {
        gsap.to(heroBadge, {
            y: -6, duration: 2.4, repeat: -1, yoyo: true, ease: "sine.inOut",
        });
    }

    console.info("[Nexora animations] ✓ GSAP animations initialised.");
})();
