// Cybersecurity Page JavaScript

// TOC Mobile Toggle
document.addEventListener('DOMContentLoaded', function() {
    const tocToggle = document.getElementById('tocToggle');
    const tocNav = document.getElementById('tocNav');
    
    if (tocToggle) {
        tocToggle.addEventListener('click', function() {
            tocNav.classList.toggle('active');
        });
    }

    // Close TOC when a link is clicked on mobile
    const tocLinks = document.querySelectorAll('.toc-link');
    tocLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                tocNav.classList.remove('active');
            }
        });
    });

    // Smooth scroll behavior for TOC links
    document.querySelectorAll('.toc-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                updateActiveTOC(href);
            }
        });
    });

    // Update active TOC link on scroll
    window.addEventListener('scroll', debounce(updateActiveTOCOnScroll, 100));

    // Handle window resize for responsive TOC
    window.addEventListener('resize', debounce(handleResize, 250));
});

// Update which TOC link is active based on scroll position
function updateActiveTOCOnScroll() {
    const sections = document.querySelectorAll('.content-section, .subsection');
    let currentSection = null;

    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop <= 150) {
            currentSection = section.id;
        }
    });

    if (currentSection) {
        updateActiveTOC('#' + currentSection);
    }
}

// Update active TOC link visually
function updateActiveTOC(id) {
    // Remove active class from all links
    document.querySelectorAll('.toc-link').forEach(link => {
        link.classList.remove('active');
    });

    // Add active class to matching link
    const activeLink = document.querySelector(`.toc-link[href="${id}"]`);
    if (activeLink) {
        activeLink.classList.add('active');

        // Scroll TOC nav to show active link
        const tocNav = document.getElementById('tocNav');
        if (tocNav) {
            const linkRect = activeLink.getBoundingClientRect();
            const navRect = tocNav.getBoundingClientRect();

            if (linkRect.top < navRect.top) {
                activeLink.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } else if (linkRect.bottom > navRect.bottom) {
                activeLink.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }
    }
}

// Handle window resize to collapse TOC on mobile
function handleResize() {
    const tocNav = document.getElementById('tocNav');
    const tocToggle = document.getElementById('tocToggle');
    
    if (window.innerWidth > 768) {
        // Desktop view - always show TOC
        if (tocNav && tocToggle) {
            tocNav.classList.remove('active');
            tocToggle.style.display = 'none';
        }
    }
}

// Debounce function for scroll and resize events
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

// Keyboard navigation - press 'n' to go to next section, 'p' for previous
document.addEventListener('keydown', function(e) {
    // Only if user isn't typing in an input field
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }

    const allSections = document.querySelectorAll('[id^="software"], [id^="comptia"], [id^="cissp"], [id^="versioning"], [id^="iam"], [id^="tls"], [id^="api"], [id^="secure"], [id^="auth"], [id^="ai"], [id^="model"], [id^="data"], [id^="nist"], [id^="ccpa"], [id^="phi"], [id^="fisma"], [id^="risk"], [id^="incident"]');
    const sectionArray = Array.from(allSections);
    
    let currentIndex = -1;
    const currentScroll = window.scrollY;

    sectionArray.forEach((section, index) => {
        if (section.getBoundingClientRect().top > 0) {
            if (currentIndex === -1) {
                currentIndex = index;
            }
        }
    });

    if (currentIndex === -1) {
        currentIndex = sectionArray.length - 1;
    }

    if (e.key === 'n' || e.key === 'N') {
        if (currentIndex < sectionArray.length - 1) {
            const nextSection = sectionArray[currentIndex + 1];
            nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            updateActiveTOC('#' + nextSection.id);
        }
    } else if (e.key === 'p' || e.key === 'P') {
        if (currentIndex > 0) {
            const prevSection = sectionArray[currentIndex - 1];
            prevSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            updateActiveTOC('#' + prevSection.id);
        }
    }
});

// Track page analytics (optional)
function trackPageView() {
    if (typeof gtag !== 'undefined') {
        gtag('pageview', {
            page_path: '/cybersecurity.html',
            page_title: 'Cybersecurity & Compliance Framework'
        });
    }
}

// Initialize on page load
window.addEventListener('load', function() {
    updateActiveTOCOnScroll();
    trackPageView();
});
