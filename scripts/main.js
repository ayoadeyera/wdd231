// 1. Hamburger Menu Toggle
const mainnav = document.querySelector('nav ul');
const hambutton = document.querySelector('#menu');

hambutton.addEventListener('click', () => {
    mainnav.classList.toggle('show');
    hambutton.classList.toggle('show');
});

// 2. Footer Dates
// Get the current year for the copyright
const currentYear = new Date().getFullYear();
document.getElementById("currentyear").textContent = currentYear;

// Get the last modified date of the document
document.getElementById("lastModified").textContent = `Last Modification: ${document.lastModified}`;