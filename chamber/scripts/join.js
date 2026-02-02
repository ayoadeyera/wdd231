// Set timestamp when form loads
document.addEventListener('DOMContentLoaded', () => {
    const timestampField = document.getElementById('timestamp');
    if (timestampField) {
        const now = new Date();
        timestampField.value = now.toISOString();
    }
});

// Modal functionality
const modals = document.querySelectorAll('.membership-modal');
const infoButtons = document.querySelectorAll('.info-btn');
const closeButtons = document.querySelectorAll('.close-modal');

// Open modal when "Learn More" is clicked
infoButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modalId = button.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.showModal();
        }
    });
});

// Close modal when close button is clicked
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('dialog');
        if (modal) {
            modal.close();
        }
    });
});

// Close modal when clicking outside the modal content
modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
        const rect = modal.getBoundingClientRect();
        const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
            rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
        if (!isInDialog) {
            modal.close();
        }
    });
});

// Close modal with Escape key
modals.forEach(modal => {
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modal.close();
        }
    });
});