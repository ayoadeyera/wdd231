// about.js - About Page Module

import { setCurrentYear, setLastModified } from './utils.js';
import { initNavigation } from './navigation.js';

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', init);

/**
 * Initialize about page
 */
function init() {
    setCurrentYear();
    setLastModified();
    initNavigation();
    
    // Setup contact form
    setupContactForm();
    
    // Add scroll animations
    addScrollAnimations();
}

/**
 * Setup contact form validation and handling
 */
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        // Form will submit to form-handler.html via GET
        // Additional validation can be added here
        console.log('Contact form submitted');
    });
    
/**
 * Initialize contact form timestamp
 */
function initContactTimestamp() {
    const timestampField = document.getElementById('contactTimestamp');
    
    if (timestampField) {
        const now = new Date();
        const formattedDate = now.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        timestampField.value = formattedDate;
    }
}

    // Add real-time validation
    const emailInput = form.querySelector('#contactEmail');
    if (emailInput) {
        emailInput.addEventListener('blur', validateEmail);
    }
    
    const phoneInput = form.querySelector('#contactPhone');
    if (phoneInput) {
        phoneInput.addEventListener('blur', validatePhone);
    }
}

/**
 * Validate email field
 * @param {Event} e - Event object
 */
function validateEmail(e) {
    const input = e.target;
    const value = input.value.trim();
    
    if (value && !isValidEmail(value)) {
        input.setCustomValidity('Please enter a valid email address');
        input.reportValidity();
    } else {
        input.setCustomValidity('');
    }
}

/**
 * Check if email is valid
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
function isValidEmail(email) {
    const re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    return re.test(email);
}

/**
 * Validate phone field
 * @param {Event} e - Event object
 */
function validatePhone(e) {
    const input = e.target;
    const value = input.value.trim();
    
    if (value && !isValidPhone(value)) {
        input.setCustomValidity('Please enter a valid phone number');
        input.reportValidity();
    } else {
        input.setCustomValidity('');
    }
}

/**
 * Check if phone is valid (basic validation)
 * @param {string} phone - Phone to validate
 * @returns {boolean} True if valid
 */
function isValidPhone(phone) {
    const re = /^[0-9+\-\s()]{10,}$/;
    return re.test(phone);
}

/**
 * Add scroll animations to timeline and team
 */
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });
    
    // Observe team members
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach((member, index) => {
        member.style.opacity = '0';
        member.style.transform = 'translateY(20px)';
        member.style.transition = `all 0.6s ease ${index * 0.15}s`;
        observer.observe(member);
    });
}
