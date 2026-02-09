// navigation.js - Navigation Module

/**
 * Initialize responsive navigation
 */
export function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('mainNav');
    
    if (!hamburger || !mainNav) return;
    
    // Toggle mobile menu
    hamburger.addEventListener('click', () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        mainNav.classList.toggle('active');
    });
    
    // Close menu when clicking nav links on mobile
    const navLinks = mainNav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                mainNav.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    });
    
    // Close menu on resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            mainNav.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
}

/**
 * Set active navigation link based on current page
 */
export function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}
