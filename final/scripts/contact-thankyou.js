// contact-thankyou.js - Display contact form submission data

import { setCurrentYear, setLastModified } from './utils.js';
import { initNavigation } from './navigation.js';

document.addEventListener('DOMContentLoaded', init);

function init() {
    setCurrentYear();
    setLastModified();
    initNavigation();
    displayFormData();
}

/**
 * Extract and display contact form data from URL parameters
 */
function displayFormData() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Get form values
    const name = urlParams.get('name');
    const email = urlParams.get('email');
    const phone = urlParams.get('phone');
    const subject = urlParams.get('subject');
    const message = urlParams.get('message');
    const timestamp = urlParams.get('timestamp');
    
    // Display name
    const nameElement = document.getElementById('displayName');
    if (nameElement && name) {
        nameElement.textContent = decodeURIComponent(name);
    }
    
    // Display email
    const emailElement = document.getElementById('displayEmail');
    const confirmEmailElement = document.getElementById('confirmEmail');
    if (email) {
        const decodedEmail = decodeURIComponent(email);
        if (emailElement) emailElement.textContent = decodedEmail;
        if (confirmEmailElement) confirmEmailElement.textContent = decodedEmail;
    }
    
    // Display phone (optional field)
    const phoneElement = document.getElementById('displayPhone');
    if (phoneElement) {
        phoneElement.textContent = phone ? decodeURIComponent(phone) : 'Not provided';
    }
    
    // Display subject (format the value)
    const subjectElement = document.getElementById('displaySubject');
    if (subjectElement && subject) {
        const formattedSubject = formatSubject(subject);
        subjectElement.textContent = formattedSubject;
    }
    
    // Display message
    const messageElement = document.getElementById('displayMessage');
    if (messageElement && message) {
        messageElement.textContent = decodeURIComponent(message);
    }
    
    // Display timestamp
    const timestampElement = document.getElementById('displayTimestamp');
    if (timestampElement && timestamp) {
        timestampElement.textContent = decodeURIComponent(timestamp);
    }
}

/**
 * Format subject value for display
 * @param {string} subject - Subject value from form
 * @returns {string} Formatted subject
 */
function formatSubject(subject) {
    const subjectMap = {
        'general': 'General Inquiry',
        'exhibition': 'Exhibition Information',
        'partnership': 'Partnership Opportunities',
        'artist': 'Artist Submissions',
        'other': 'Other'
    };
    
    return subjectMap[subject] || subject;
}
