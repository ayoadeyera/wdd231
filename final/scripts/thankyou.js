// thankyou.js - Display form submission data

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
 * Extract and display form data from URL parameters
 */
function displayFormData() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Get form values
    const fullname = urlParams.get('fullname');
    const email = urlParams.get('email');
    const interests = urlParams.get('interests');
    const timestamp = urlParams.get('timestamp');
    
    // Display name
    const nameElement = document.getElementById('displayName');
    if (nameElement && fullname) {
        nameElement.textContent = decodeURIComponent(fullname);
    }
    
    // Display email
    const emailElement = document.getElementById('displayEmail');
    if (emailElement && email) {
        emailElement.textContent = decodeURIComponent(email);
    }
    
    // Display interests
    const interestsElement = document.getElementById('displayInterests');
    if (interestsElement && interests) {
        const formattedInterest = formatInterest(interests);
        interestsElement.textContent = formattedInterest;
    }
    
    // Display timestamp
    const timestampElement = document.getElementById('displayTimestamp');
    if (timestampElement && timestamp) {
        timestampElement.textContent = decodeURIComponent(timestamp);
    }
}

/**
 * Format interest value for display
 * @param {string} interest - Interest value from form
 * @returns {string} Formatted interest
 */
function formatInterest(interest) {
    const interestMap = {
        'contemporary': 'Contemporary Art',
        'abstract': 'Abstract',
        'sculpture': 'Sculpture',
        'photography': 'Photography',
        'digital': 'Digital Art',
        'all': 'All Exhibitions'
    };
    
    return interestMap[interest] || interest;
}