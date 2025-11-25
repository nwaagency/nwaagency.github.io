/* ========================================
   RED WOLF SECURITY - MAIN JAVASCRIPT
   File: script.js
   ======================================== */

// ========================================
// 1. UTILITY FUNCTIONS
// ========================================

/**
 * Debounce function to limit function calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Smooth scroll to element
 */
function smoothScrollTo(element, offset = 0) {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// ========================================
// 2. MOBILE MENU
// ========================================

class MobileMenu {
    constructor() {
        this.menuToggle = document.querySelector('.mobile-menu-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.init();
    }

    init() {
        if (!this.menuToggle || !this.navMenu) return;

        // Create mobile menu toggle button if it doesn't exist
        if (!this.menuToggle) {
            this.createToggleButton();
        }

        this.menuToggle.addEventListener('click', () => this.toggleMenu());
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('nav')) {
                this.closeMenu();
            }
        });

        // Close menu when window is resized to desktop
        window.addEventListener('resize', debounce(() => {
            if (window.innerWidth > 768) {
                this.closeMenu();
            }
        }, 250));
    }

    createToggleButton() {
        const nav = document.querySelector('nav');
        const toggle = document.createElement('button');
        toggle.className = 'mobile-menu-toggle';
        toggle.setAttribute('aria-label', 'Toggle mobile menu');
        toggle.innerHTML = '☰';
        nav.insertBefore(toggle, nav.firstChild);
        this.menuToggle = toggle;
    }

    toggleMenu() {
        this.navMenu.classList.toggle('active');
        const isOpen = this.navMenu.classList.contains('active');
        this.menuToggle.setAttribute('aria-expanded', isOpen);
        this.menuToggle.innerHTML = isOpen ? '✕' : '☰';
    }

    closeMenu() {
        this.navMenu.classList.remove('active');
        this.menuToggle.setAttribute('aria-expanded', 'false');
        this.menuToggle.innerHTML = '☰';
    }
}

// ========================================
// 3. FORM VALIDATION
// ========================================

class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (!this.form) return;
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const inputs = this.form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        // Special validation for checkboxes (at least one service selected)
        if (this.form.id === 'quoteForm') {
            const services = this.form.querySelectorAll('input[name="services"]:checked');
            if (services.length === 0) {
                alert('Please select at least one service.');
                isValid = false;
            }
        }

        if (isValid) {
            this.submitForm();
        }
    }

    validateField(input) {
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Check if required field is empty
        if (input.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Phone validation
        if (input.type === 'tel' && value) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(value) || value.length < 10) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        // Update UI
        if (!isValid) {
            this.showError(input, errorMessage);
        } else {
            this.clearError(input);
        }

        return isValid;
    }

    showError(input, message) {
        input.classList.add('error');
        input.style.borderColor = '#d32f2f';
        
        // Remove existing error message
        const existingError = input.parentElement.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }

        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.textContent = message;
        input.parentElement.appendChild(errorDiv);
    }

    clearError(input) {
        input.classList.remove('error');
        input.style.borderColor = '';
        
        const errorDiv = input.parentElement.querySelector('.form-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    submitForm() {
        const formData = new FormData(this.form);
        const data = {};
        
        // Collect form data
        for (let [key, value] of formData.entries()) {
            if (key === 'services') {
                if (!data.services) data.services = [];
                data.services.push(value);
            } else {
                data[key] = value;
            }
        }

        console.log('Form submitted:', data);

        // Show success message
        this.showSuccessMessage();

        // In production, you would send data to server here
        // Example: fetch('/api/submit', { method: 'POST', body: JSON.stringify(data) })
    }

    showSuccessMessage() {
        const messageMap = {
            'contactForm': 'Thank you for contacting Red Wolf Security! We will get back to you within 24 hours.',
            'quoteForm': 'Thank you for your quote request! Our security experts will review your requirements and contact you within 24 hours with a detailed proposal.'
        };

        const message = messageMap[this.form.id] || 'Form submitted successfully!';
        
        alert(message);
        this.form.reset();

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ========================================
// 4. SCROLL ANIMATIONS
// ========================================

class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
        this.init();
    }

    init() {
        if (this.elements.length === 0) return;

        // Initial check
        this.checkElements();

        // Check on scroll
        window.addEventListener('scroll', debounce(() => this.checkElements(), 100));
    }

    checkElements() {
        this.elements.forEach(element => {
            if (isInViewport(element)) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0) translateX(0)';
            }
        });
    }
}

// ========================================
// 5. STICKY HEADER
// ========================================

class StickyHeader {
    constructor() {
        this.header = document.querySelector('header');
        this.init();
    }

    init() {
        if (!this.header) return;

        let lastScroll = 0;

        window.addEventListener('scroll', debounce(() => {
            const currentScroll = window.pageYOffset;

            // Add shadow when scrolled
            if (currentScroll > 0) {
                this.header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
            } else {
                this.header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            }

            lastScroll = currentScroll;
        }, 50));
    }
}

// ========================================
// 6. FILE UPLOAD HANDLER
// ========================================

class FileUploadHandler {
    constructor() {
        this.fileInput = document.getElementById('fileUpload');
        if (!this.fileInput) return;
        this.init();
    }

    init() {
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
    }

    handleFileSelect(e) {
        const files = e.target.files;
        if (files.length === 0) return;

        // Validate file size (10MB max)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        let isValid = true;

        Array.from(files).forEach(file => {
            if (file.size > maxSize) {
                alert(`File "${file.name}" is too large. Maximum size is 10MB.`);
                isValid = false;
            }
        });

        if (!isValid) {
            this.fileInput.value = '';
            return;
        }

        // Update UI to show selected files
        const fileNames = Array.from(files).map(f => f.name).join(', ');
        const label = document.querySelector('.file-upload-label');
        if (label) {
            label.innerHTML = `Selected: ${fileNames}<br><small>Click to change files</small>`;
        }
    }
}

// ========================================
// 7. BACK TO TOP BUTTON
// ========================================

class BackToTopButton {
    constructor() {
        this.createButton();
        this.init();
    }

    createButton() {
        const button = document.createElement('button');
        button.id = 'backToTop';
        button.className = 'back-to-top';
        button.innerHTML = '↑';
        button.setAttribute('aria-label', 'Back to top');
        button.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #8d220f, #cc9d1d);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
            box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(button);
        this.button = button;
    }

    init() {
        // Show/hide button on scroll
        window.addEventListener('scroll', debounce(() => {
            if (window.pageYOffset > 300) {
                this.button.style.opacity = '1';
                this.button.style.visibility = 'visible';
            } else {
                this.button.style.opacity = '0';
                this.button.style.visibility = 'hidden';
            }
        }, 100));

        // Scroll to top on click
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Hover effect
        this.button.addEventListener('mouseenter', () => {
            this.button.style.transform = 'translateY(-5px)';
            this.button.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
        });

        this.button.addEventListener('mouseleave', () => {
            this.button.style.transform = 'translateY(0)';
            this.button.style.boxShadow = '0 4px 6px rgba(0,0,0,0.2)';
        });
    }
}

// ========================================
// 8. LOADING ANIMATION
// ========================================

class LoadingAnimation {
    constructor() {
        this.createLoader();
    }

    createLoader() {
        const loader = document.createElement('div');
        loader.id = 'pageLoader';
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.3s ease;
        `;
        loader.innerHTML = `
            <div style="text-align: center;">
                <div style="
                    width: 50px;
                    height: 50px;
                    border: 5px solid #f3f3f3;
                    border-top: 5px solid #8d220f;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                "></div>
                <p style="margin-top: 1rem; color: #8d220f; font-weight: bold;">Loading...</p>
            </div>
        `;

        // Add spinner animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(loader);
        this.loader = loader;
    }

    hide() {
        setTimeout(() => {
            this.loader.style.opacity = '0';
            setTimeout(() => {
                this.loader.style.display = 'none';
            }, 300);
        }, 500);
    }
}

// ========================================
// 9. SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================

class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Get all anchor links
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Skip if it's just "#"
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    smoothScrollTo(target, 80); // 80px offset for header
                }
            });
        });
    }
}

// ========================================
// 10. LAZY LOADING IMAGES
// ========================================

class LazyLoadImages {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            });

            this.images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            this.images.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }
}

// ========================================
// 11. CARD HOVER EFFECTS
// ========================================

class CardEffects {
    constructor() {
        this.cards = document.querySelectorAll('.card, .service-card, .value-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }
}

// ========================================
// 12. ACCESSIBILITY ENHANCEMENTS
// ========================================

class AccessibilityEnhancements {
    constructor() {
        this.init();
    }

    init() {
        // Add keyboard navigation for cards
        const interactiveCards = document.querySelectorAll('.service-card, .value-card');
        interactiveCards.forEach(card => {
            card.setAttribute('tabindex', '0');
            
            card.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    const link = card.querySelector('a');
                    if (link) {
                        link.click();
                    }
                }
            });
        });

        // Announce page changes to screen readers
        this.announcePageTitle();
    }

    announcePageTitle() {
        const h1 = document.querySelector('h1');
        if (h1) {
            h1.setAttribute('aria-live', 'polite');
        }
    }
}

// ========================================
// 13. LOCAL STORAGE FOR FORM DATA
// ========================================

class FormPersistence {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (!this.form) return;
        this.storageKey = `redwolf_${formId}`;
        this.init();
    }

    init() {
        // Load saved data
        this.loadFormData();

        // Save data on input
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', debounce(() => this.saveFormData(), 500));
        });

        // Clear data on successful submit
        this.form.addEventListener('submit', () => {
            setTimeout(() => this.clearFormData(), 1000);
        });
    }

    saveFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    loadFormData() {
        const savedData = localStorage.getItem(this.storageKey);
        if (!savedData) return;

        const data = JSON.parse(savedData);
        
        Object.keys(data).forEach(key => {
            const input = this.form.querySelector(`[name="${key}"]`);
            if (input && input.type !== 'password') {
                input.value = data[key];
            }
        });
    }

    clearFormData() {
        localStorage.removeItem(this.storageKey);
    }
}

// ========================================
// 14. INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize page loader
    const loader = new LoadingAnimation();
    
    // Hide loader when page is fully loaded
    window.addEventListener('load', () => {
        loader.hide();
    });

    // Initialize all components
    new MobileMenu();
    new StickyHeader();
    new BackToTopButton();
    new SmoothScroll();
    new LazyLoadImages();
    new ScrollAnimations();
    new CardEffects();
    new AccessibilityEnhancements();

    // Initialize forms if they exist
    if (document.getElementById('contactForm')) {
        new FormValidator('contactForm');
        new FormPersistence('contactForm');
    }

    if (document.getElementById('quoteForm')) {
        new FormValidator('quoteForm');
        new FileUploadHandler();
        new FormPersistence('quoteForm');
    }

    // Log initialization
    console.log('Red Wolf Security website initialized successfully');
});

// ========================================
// 15. SERVICE WORKER (Optional - for PWA)
// ========================================

// Uncomment to enable service worker for offline functionality
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}
*/

// ========================================
// 16. PERFORMANCE MONITORING
// ========================================

// Monitor page performance
window.addEventListener('load', () => {
    if ('performance' in window) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms`);
    }
});

// ========================================
// 17. ERROR HANDLING
// ========================================

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // In production, you might want to send errors to a logging service
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // In production, you might want to send errors to a logging service
});

// ========================================
// END OF SCRIPT
// ========================================