/**
 * NAVIGATION MODULE - Handles the hamburger menu toggle
 */
const mainnav = document.querySelector('nav ul');
const hambutton = document.querySelector('#menu');

hambutton.addEventListener('click', () => {
    mainnav.classList.toggle('show');
    // Change icon between Hamburger
    hambutton.innerHTML = mainnav.classList.contains('show') ? "&#10006;" : "&#9776;";
});