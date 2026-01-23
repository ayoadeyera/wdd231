const url = 'data/members.json';
const cards = document.querySelector('#members');

// 1. Async Function to Fetch Data
async function getMembers() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Call the function to display the members
        displayMembers(data);
    } catch (error) {
        console.error('Error fetching member data:', error);
    }
}

// 2. Function to Build Member Cards
const displayMembers = (members) => {
    cards.innerHTML = ''; // Clear loading message or existing content

    members.forEach((member) => {
        // Create elements
        let card = document.createElement('section');
        let fullName = document.createElement('h3');
        let logo = document.createElement('img');
        let address = document.createElement('p');
        let phone = document.createElement('p');
        let website = document.createElement('a');
        let level = document.createElement('p');

        // Content
        fullName.textContent = member.name;
        address.textContent = member.address;
        phone.textContent = member.phone;

        website.textContent = "Visit Website";
        website.href = member.website;
        website.target = "_blank"; // Open in new tab

        level.textContent = `Membership Level: ${member.membership_level}`;
        level.setAttribute('class', 'membership-level'); // For styling if needed

        // Image Attributes
        logo.setAttribute('src', member.image);
        logo.setAttribute('alt', `Logo of ${member.name}`);
        logo.setAttribute('loading', 'lazy'); // Good for performance
        logo.setAttribute('width', '150');
        logo.setAttribute('height', '100');

        // Append to card
        card.appendChild(logo);
        card.appendChild(fullName);
        card.appendChild(address);
        card.appendChild(phone);
        card.appendChild(website);
        card.appendChild(level);

        // Append card to main container
        cards.appendChild(card);
    });
};

// 3. Grid/List Toggle Functionality
const gridButton = document.querySelector("#grid");
const listButton = document.querySelector("#list");
const display = document.querySelector("#members"); // The article container

// Default view
display.classList.add("grid");

listButton.addEventListener("click", () => {
    display.classList.add("list");
    display.classList.remove("grid");

    // Toggle active button styling
    listButton.classList.add("active");
    gridButton.classList.remove("active");
});

gridButton.addEventListener("click", () => {
    display.classList.add("grid");
    display.classList.remove("list");

    // Toggle active button styling
    gridButton.classList.add("active");
    listButton.classList.remove("active");
});

// Initialize
getMembers();