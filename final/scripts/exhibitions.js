// exhibitions.js - Exhibitions Page Module

import { setCurrentYear, setLastModified, storage, formatDateRange } from './utils.js';
import { Modal } from './modal.js';
import { initNavigation } from './navigation.js';

let exhibitionsData = [];
let filteredExhibitions = [];

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', init);

/**
 * Initialize exhibitions page
 */
async function init() {
    setCurrentYear();
    setLastModified();
    initNavigation();
    
    // Initialize modal
    const exhibitionModal = new Modal('exhibitionModal');
    
    // Load exhibitions
    await loadAllExhibitions();
    
    // Setup filters and controls
    setupFilters();
    setupViewToggle();
    
    // Setup modal interactions
    setupExhibitionModals(exhibitionModal);
}

/**
 * Fetch and display all exhibitions
 */
async function loadAllExhibitions() {
    const container = document.getElementById('exhibitionsContainer');
    const loading = document.getElementById('loadingIndicator');
    
    if (!container) return;
    
    try {
        // Show loading
        loading?.removeAttribute('hidden');
        container.innerHTML = '';
        
        // Fetch data
        const response = await fetch('data/exhibitions.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        exhibitionsData = data.exhibitions;
        filteredExhibitions = [...exhibitionsData];
        
        // Display all exhibitions
        displayExhibitions(filteredExhibitions);
        updateExhibitionCount(filteredExhibitions.length);
        
        // Hide loading
        loading?.setAttribute('hidden', '');
        
        // Save to local storage
        storage.set('exhibitionsData', data);
        
    } catch (error) {
        console.error('Error loading exhibitions:', error);
        
        // Try local storage
        const cachedData = storage.get('exhibitionsData');
        if (cachedData && cachedData.exhibitions) {
            exhibitionsData = cachedData.exhibitions;
            filteredExhibitions = [...exhibitionsData];
            displayExhibitions(filteredExhibitions);
            updateExhibitionCount(filteredExhibitions.length);
        } else {
            container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #D4623F;">Unable to load exhibitions. Please check your connection.</p>';
        }
        
        loading?.setAttribute('hidden', '');
    }
}

/**
 * Display exhibitions using array methods
 * @param {Array} exhibitions - Array of exhibitions to display
 */
function displayExhibitions(exhibitions) {
    const container = document.getElementById('exhibitionsContainer');
    const noResults = document.getElementById('noResults');
    
    if (!container) return;
    
    if (exhibitions.length === 0) {
        container.innerHTML = '';
        noResults?.removeAttribute('hidden');
        return;
    }
    
    noResults?.setAttribute('hidden', '');
    
    // Use map to create exhibition cards
    const html = exhibitions
        .map(exhibition => createExhibitionCard(exhibition))
        .join('');
    
    container.innerHTML = html;
    
    // Add lazy loading
    const images = container.querySelectorAll('img');
    images.forEach(img => {
        img.loading = 'lazy';
    });
}

/**
 * Create exhibition card HTML
 * @param {Object} exhibition - Exhibition data
 * @returns {string} HTML string
 */
function createExhibitionCard(exhibition) {
    const dateRange = formatDateRange(exhibition.startDate, exhibition.endDate);
    const badge = exhibition.featured ? '<span class="exhibition-badge">Featured</span>' : '';
    const availabilityClass = exhibition.available ? '' : 'unavailable';
    
    return `
        <div class="exhibition-card ${availabilityClass}" data-id="${exhibition.id}">
            <div class="exhibition-image">
                <img src="${exhibition.imageUrl}" alt="${exhibition.title} by ${exhibition.artist}" loading="lazy">
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
 * Setup filter controls
 */
function setupFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const sortBy = document.getElementById('sortBy');
    const resetBtn = document.getElementById('resetFilters');
    
    // Category filter
    categoryFilter?.addEventListener('change', applyFilters);
    
    // Sort by
    sortBy?.addEventListener('change', applyFilters);
    
    // Reset filters
    resetBtn?.addEventListener('click', () => {
        if (categoryFilter) categoryFilter.value = 'all';
        if (sortBy) sortBy.value = 'featured';
        applyFilters();
    });
    
    // Load saved preferences
    const savedCategory = storage.get('filterCategory');
    const savedSort = storage.get('filterSort');
    
    if (savedCategory && categoryFilter) {
        categoryFilter.value = savedCategory;
    }
    if (savedSort && sortBy) {
        sortBy.value = savedSort;
    }
}

/**
 * Apply filters and sorting
 */
function applyFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const sortBy = document.getElementById('sortBy');
    
    const category = categoryFilter?.value || 'all';
    const sort = sortBy?.value || 'featured';
    
    // Save preferences
    storage.set('filterCategory', category);
    storage.set('filterSort', sort);
    
    // Filter by category using filter method
    filteredExhibitions = category === 'all' 
        ? [...exhibitionsData]
        : exhibitionsData.filter(ex => ex.category === category);
    
    // Sort using array methods
    filteredExhibitions.sort((a, b) => {
        switch(sort) {
            case 'featured':
                return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
            case 'date':
                return new Date(a.startDate) - new Date(b.startDate);
            case 'title':
                return a.title.localeCompare(b.title);
            case 'artist':
                return a.artist.localeCompare(b.artist);
            default:
                return 0;
        }
    });
    
    displayExhibitions(filteredExhibitions);
    updateExhibitionCount(filteredExhibitions.length);
}

/**
 * Update exhibition count display
 * @param {number} count - Number of exhibitions
 */
function updateExhibitionCount(count) {
    const countElement = document.getElementById('exhibitionCount');
    if (countElement) {
        countElement.textContent = count;
    }
}

/**
 * Setup view toggle (grid/list)
 */
function setupViewToggle() {
    const gridViewBtn = document.getElementById('gridView');
    const listViewBtn = document.getElementById('listView');
    const container = document.getElementById('exhibitionsContainer');
    
    if (!gridViewBtn || !listViewBtn || !container) return;
    
    // Load saved preference
    const savedView = storage.get('viewPreference') || 'grid';
    if (savedView === 'list') {
        container.classList.remove('grid-view');
        container.classList.add('list-view');
        gridViewBtn.classList.remove('active');
        listViewBtn.classList.add('active');
    }
    
    gridViewBtn.addEventListener('click', () => {
        container.classList.remove('list-view');
        container.classList.add('grid-view');
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        storage.set('viewPreference', 'grid');
    });
    
    listViewBtn.addEventListener('click', () => {
        container.classList.remove('grid-view');
        container.classList.add('list-view');
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
        storage.set('viewPreference', 'list');
    });
}

/**
 * Setup modal for exhibition details
 * @param {Modal} modal - Modal instance
 */
function setupExhibitionModals(modal) {
    // Use event delegation for dynamically created cards
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.exhibition-card');
        if (card) {
            const exhibitionId = parseInt(card.dataset.id);
            const exhibition = exhibitionsData.find(ex => ex.id === exhibitionId);
            
            if (exhibition) {
                const content = createExhibitionModalContent(exhibition);
                modal.open(content);
            }
        }
    });
}

/**
 * Create exhibition detail modal content
 * @param {Object} exhibition - Exhibition data
 * @returns {string} HTML content
 */
function createExhibitionModalContent(exhibition) {
    const dateRange = formatDateRange(exhibition.startDate, exhibition.endDate);
    
    return `
        <div class="exhibition-modal-content">
            <img src="${exhibition.imageUrl}" alt="${exhibition.title}" style="width: 100%; border-radius: 12px; margin-bottom: 1.5rem;">
            <p class="exhibition-category">${exhibition.category}</p>
            <h2 style="font-family: var(--font-display); font-size: 2rem; margin-bottom: 0.5rem;">${exhibition.title}</h2>
            <p style="font-size: 1.25rem; color: var(--color-secondary-text); margin-bottom: 1rem;">by ${exhibition.artist}</p>
            <p style="margin-bottom: 1rem;"><strong>📅 ${dateRange}</strong></p>
            <p style="line-height: 1.7; margin-bottom: 1.5rem;">${exhibition.description}</p>
            ${exhibition.available 
                ? '<p style="color: var(--color-accent); font-weight: 600;">Currently on view</p>' 
                : '<p style="color: var(--color-graphite);">Coming soon</p>'
            }
        </div>
    `;
}
