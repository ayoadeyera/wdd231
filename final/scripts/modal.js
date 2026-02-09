// modal.js - Modal Dialog Module

/**
 * Modal Dialog Manager
 */
export class Modal {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        this.closeBtn = this.modal?.querySelector('.modal-close');
        this.isOpen = false;
        this.init();
    }
    
    init() {
        if (!this.modal) return;
        
        // Close button click
        this.closeBtn?.addEventListener('click', () => this.close());
        
        // Close on backdrop click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }
    
    open(content) {
        if (!this.modal) return;
        
        // Set content if provided
        if (content) {
            const modalBody = this.modal.querySelector('#modalBody') || 
                             this.modal.querySelector('[id$="ModalContent"]');
            if (modalBody) {
                modalBody.innerHTML = content;
            }
        }
        
        // Show modal
        this.modal.classList.add('active');
        this.modal.setAttribute('aria-hidden', 'false');
        this.isOpen = true;
        
        // Trap focus
        this.trapFocus();
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
    
    close() {
        if (!this.modal) return;
        
        this.modal.classList.remove('active');
        this.modal.setAttribute('aria-hidden', 'true');
        this.isOpen = false;
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
    
    trapFocus() {
        const focusableElements = this.modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        // Focus first element
        firstElement.focus();
        
        // Tab trap
        this.modal.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }
}

/**
 * Create event registration modal content
 * @param {string} eventType - Type of event
 * @returns {string} HTML content for modal
 */
export function createEventModalContent(eventType) {
    const eventTitles = {
        talk: 'Artist Talk Registration',
        reception: 'Gallery Night Registration',
        workshop: 'Workshop Registration'
    };
    
    const title = eventTitles[eventType] || 'Event Registration';
    
    return `
        <p>Thank you for your interest in this event!</p>
        <p>To complete your registration, please visit our gallery or call us at <a href="tel:+2341234567890">+234 123 456 7890</a>.</p>
        <p>We look forward to seeing you!</p>
        <div style="margin-top: 1.5rem;">
            <button class="btn btn-primary" onclick="this.closest('.modal').querySelector('.modal-close').click()">Close</button>
        </div>
    `;
}
