// 1. Dynamic Copyright Year
const currentYear = new Date().getFullYear();
document.getElementById("currentYear").textContent = currentYear;

// 2. Last Modified Date
// This captures the date the file was last saved/uploaded to the server
let lastMod = document.lastModified;
document.getElementById("lastModified").textContent = `Last Modification: ${lastMod}`;

// 3. Hamburger Menu Functionality
const hamButton = document.querySelector('#menu-button');
const navigation = document.querySelector('#menu-list');

hamButton.addEventListener('click', () => {
    navigation.classList.toggle('open');
    hamButton.classList.toggle('open');
});