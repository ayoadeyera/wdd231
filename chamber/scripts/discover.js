// Import items of interest data
import { itemsOfInterest } from './places.mjs';

// Constants
const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
const LAST_VISIT_KEY = 'lastVisit';

// ==================== VISIT TRACKING ====================

/**
 * Calculate days between two dates
 */
function calculateDaysBetween(date1, date2) {
    const diffInMs = Math.abs(date2 - date1);
    return Math.floor(diffInMs / MILLISECONDS_PER_DAY);
}

/**
 * Display visit message based on localStorage
 */
function displayVisitMessage() {
    const visitBanner = document.getElementById('visit-message');
    const visitText = document.getElementById('visit-text');
    const closeBanner = document.getElementById('close-banner');

    if (!visitBanner || !visitText) return;

    // Get current time
    const now = Date.now();

    // Get last visit from localStorage
    const lastVisit = localStorage.getItem(LAST_VISIT_KEY);

    let message = '';

    if (!lastVisit) {
        // First visit
        message = "Welcome! Let us know if you have any questions.";
    } else {
        // Calculate days since last visit
        const lastVisitTime = parseInt(lastVisit);
        const daysSinceLastVisit = calculateDaysBetween(lastVisitTime, now);

        if (daysSinceLastVisit < 1) {
            // Less than a day
            message = "Back so soon! Awesome!";
        } else if (daysSinceLastVisit === 1) {
            // Exactly 1 day
            message = "You last visited 1 day ago.";
        } else {
            // More than 1 day
            message = `You last visited ${daysSinceLastVisit} days ago.`;
        }
    }

    // Display message
    visitText.textContent = message;
    visitBanner.classList.add('show');

    // Store current visit time
    localStorage.setItem(LAST_VISIT_KEY, now.toString());

    // Close banner on button click
    if (closeBanner) {
        closeBanner.addEventListener('click', () => {
            visitBanner.classList.remove('show');
            visitBanner.classList.add('hidden');
        });
    }

    // Auto-hide after 10 seconds
    setTimeout(() => {
        if (visitBanner.classList.contains('show')) {
            visitBanner.classList.remove('show');
            visitBanner.classList.add('hidden');
        }
    }, 10000);
}

// ==================== CARD GENERATION ====================

/**
 * Create a card for an item of interest
 */
function createItemCard(item) {
    // Create card container
    const card = document.createElement('article');
    card.classList.add('item-card');
    card.setAttribute('data-id', item.id);

    // Create card title
    const title = document.createElement('h2');
    title.textContent = item.name;
    title.classList.add('card-title');

    // Create figure for image
    const figure = document.createElement('figure');
    figure.classList.add('card-figure');

    const img = document.createElement('img');
    img.src = `images/${item.image}`;
    img.alt = item.name;
    img.loading = 'lazy';
    img.width = 300;
    img.height = 200;
    img.classList.add('card-image');

    const figcaption = document.createElement('figcaption');
    figcaption.textContent = item.name;
    figcaption.classList.add('sr-only'); // Screen reader only

    figure.appendChild(img);
    figure.appendChild(figcaption);

    // Create address
    const address = document.createElement('address');
    address.textContent = item.address;
    address.classList.add('card-address');

    // Create description
    const description = document.createElement('p');
    description.textContent = item.description;
    description.classList.add('card-description');

    // Create cost info
    const cost = document.createElement('p');
    cost.innerHTML = `<strong>Cost:</strong> ${item.estimated_cost}`;
    cost.classList.add('card-cost');

    // Create "Learn More" button
    const button = document.createElement('button');
    button.textContent = 'Learn More';
    button.classList.add('learn-more-btn');
    button.setAttribute('aria-label', `Learn more about ${item.name}`);
    
    // Button click handler (can be customized)
    button.addEventListener('click', () => {
        alert(`More information about ${item.name} coming soon!`);
    });

    // Append all elements to card
    card.appendChild(title);
    card.appendChild(figure);
    card.appendChild(address);
    card.appendChild(description);
    card.appendChild(cost);
    card.appendChild(button);

    return card;
}

/**
 * Display all items of interest
 */
function displayItems() {
    const grid = document.getElementById('items-grid');
    
    if (!grid) {
        console.error('Items grid container not found');
        return;
    }

    // Clear existing content
    grid.innerHTML = '';

    // Create and append cards for each item
    itemsOfInterest.forEach(item => {
        const card = createItemCard(item);
        grid.appendChild(card);
    });

    console.log(`Displayed ${itemsOfInterest.length} items of interest`);
}

// ==================== INITIALIZATION ====================

/**
 * Initialize the discover page
 */
function init() {
    // Display visit message
    displayVisitMessage();

    // Display items of interest
    displayItems();

    console.log('Discover page initialized');
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', init);