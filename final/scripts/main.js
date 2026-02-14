// main.js - Home Page Main Module

import { setCurrentYear, setLastModified, storage, formatDateRange, isActiveExhibition } from './utils.js';
import { Modal, createEventModalContent } from './modal.js';
import { initNavigation } from './navigation.js';

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', init);

/**
 * Initialize home page
 */
async function init() {
    // Set up common elements
    setCurrentYear();
    setLastModified();
    initNavigation();
    
    // Initialize modal
    const eventModal = new Modal('eventModal');
    
    // Load exhibitions
    await loadCurrentExhibitions();
    
    // Set up event registration
    setupEventRegistration(eventModal);
    
    // Check for returning visitor
    handleReturningVisitor();
}


// Add timestamp to newsletter form
    initNewsletterTimestamp();
}

/**
 * Initialize newsletter form timestamp
 */
function initNewsletterTimestamp() {
    const timestampField = document.getElementById('timestamp');
    
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



/**
 * Fetch and display current exhibitions
 */
async function loadCurrentExhibitions() {
    const grid = document.getElementById('currentExhibitionsGrid');
    if (!grid) return;
    
    try {
        // Show loading state
        grid.innerHTML = '<p style="text-align: center; padding: 2rem;">Loading exhibitions...</p>';
        
        // Fetch data
        const response = await fetch('data/exhibitions.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Filter for current/active exhibitions (limit to 3 for home page)
        const currentExhibitions = data.exhibitions
            .filter(ex => ex.available && isActiveExhibition(ex.startDate, ex.endDate))
            .slice(0, 3);
        
        // Display exhibitions
        if (currentExhibitions.length > 0) {
            displayExhibitions(currentExhibitions, grid);
        } else {
            grid.innerHTML = '<p style="text-align: center; padding: 2rem;">No current exhibitions available.</p>';
        }
        
        // Save to local storage for offline access
        storage.set('exhibitionsData', data);
        storage.set('lastFetched', new Date().toISOString());
        
    } catch (error) {
        console.error('Error loading exhibitions:', error);
        
        // Try to load from local storage
        const cachedData = storage.get('exhibitionsData');
        if (cachedData && cachedData.exhibitions) {
            const currentExhibitions = cachedData.exhibitions
                .filter(ex => ex.available && isActiveExhibition(ex.startDate, ex.endDate))
                .slice(0, 3);
            displayExhibitions(currentExhibitions, grid);
        } else {
            grid.innerHTML = '<p style="text-align: center; padding: 2rem; color: #D4623F;">Unable to load exhibitions. Please try again later.</p>';
        }
    }
}

/**
 * Display exhibitions in grid
 * @param {Array} exhibitions - Array of exhibition objects
 * @param {HTMLElement} container - Container element
 */
function displayExhibitions(exhibitions, container) {
    const html = exhibitions.map(exhibition => createExhibitionCard(exhibition)).join('');
    container.innerHTML = html;
    
    // Add lazy loading to images
    const images = container.querySelectorAll('img');
    images.forEach(img => {
        img.loading = 'lazy';
    });
}

/**
 * Create exhibition card HTML using template literal
 * @param {Object} exhibition - Exhibition object
 * @returns {string} HTML string
 */
function createExhibitionCard(exhibition) {
    const dateRange = formatDateRange(exhibition.startDate, exhibition.endDate);
    const badge = exhibition.featured ? '<span class="exhibition-badge">Featured</span>' : '';
    
    return `
        <div class="exhibition-card" data-id="${exhibition.id}">
            <div class="exhibition-image">
                <img src="${exhibition.imageUrl}" alt="${exhibition.title} exhibition artwork" loading="lazy">
                ${badge}
            </div>
            <div class="exhibition-content">
                <p class="exhibition-category">${exhibition.category}</p>
                <h3 class="exhibition-title">${exhibition.title}</h3>
                <p class="exhibition-artist">by ${exhibition.artist}</p>
                <p class="exhibition-dates">📅 ${dateRange}</p>
                <p class="exhibition-description">${exhibition.description}</p>
            </div>
        </div>
    `;
}

/**
 * Setup event registration buttons
 * @param {Modal} modal - Modal instance
 */
function setupEventRegistration(modal) {
    const eventButtons = document.querySelectorAll('[data-event]');
    
    eventButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const eventType = e.target.dataset.event;
            const content = createEventModalContent(eventType);
            modal.open(content);
            
            // Track event interest in local storage
            trackEventInterest(eventType);
        });
    });
}

/**
 * Track event interest in local storage
 * @param {string} eventType - Type of event
 */
function trackEventInterest(eventType) {
    const interests = storage.get('eventInterests') || [];
    interests.push({
        type: eventType,
        timestamp: new Date().toISOString()
    });
    storage.set('eventInterests', interests);
}

/**
 * Handle returning visitor personalization
 */
function handleReturningVisitor() {
    const visitCount = storage.get('visitCount') || 0;
    const newCount = visitCount + 1;
    storage.set('visitCount', newCount);
    
    const lastVisit = storage.get('lastVisit');
    storage.set('lastVisit', new Date().toISOString());
    
    // Show personalized message for returning visitors
    if (newCount > 1 && lastVisit) {
        console.log(`Welcome back! This is visit #${newCount}`);
        // Could add a welcome back message here
    }
}
