// utils.js - Utility Functions Module

/**
 * Format date to readable string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

/**
 * Format date range
 * @param {string} startDate - Start date string
 * @param {string} endDate - End date string
 * @returns {string} Formatted date range
 */
export function formatDateRange(startDate, endDate) {
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    return `${start} - ${end}`;
}

/**
 * Check if exhibition is currently active
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {boolean} True if exhibition is active
 */
export function isActiveExhibition(startDate, endDate) {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
}

/**
 * Set current year in footer
 */
export function setCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/**
 * Set last modified date
 */
export function setLastModified() {
    const modifiedElement = document.getElementById('lastModified');
    if (modifiedElement) {
        modifiedElement.textContent = document.lastModified;
    }
}

/**
 * Local Storage Helper
 */
export const storage = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },
    
    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    }
};

/**
 * Debounce function for performance
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300) {
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
