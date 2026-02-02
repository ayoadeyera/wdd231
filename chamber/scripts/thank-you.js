// Extract and display form data from URL parameters
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);

    // Get form data from URL
    const firstName = urlParams.get('first-name') || '';
    const lastName = urlParams.get('last-name') || '';
    const email = urlParams.get('email') || '';
    const mobile = urlParams.get('mobile') || '';
    const businessName = urlParams.get('business-name') || '';
    const timestamp = urlParams.get('timestamp') || '';

    // Display the data
    const displayName = document.getElementById('display-name');
    const displayEmail = document.getElementById('display-email');
    const displayMobile = document.getElementById('display-mobile');
    const displayBusiness = document.getElementById('display-business');
    const displayTimestamp = document.getElementById('display-timestamp');

    if (displayName) {
        displayName.textContent = `${firstName} ${lastName}`;
    }

    if (displayEmail) {
        displayEmail.textContent = email;
    }

    if (displayMobile) {
        displayMobile.textContent = mobile;
    }

    if (displayBusiness) {
        displayBusiness.textContent = businessName;
    }

    if (displayTimestamp && timestamp) {
        // Format the timestamp to a readable date
        const date = new Date(timestamp);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        };
        displayTimestamp.textContent = date.toLocaleString('en-US', options);
    }
});