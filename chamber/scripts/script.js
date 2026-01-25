// Dynamic Copyright Year
const currentYear = new Date().getFullYear();
const yearSpan = document.getElementById("currentYear");
if (yearSpan) {
    yearSpan.textContent = currentYear;
}

// Last Modified Date
let lastMod = document.lastModified;
const lastModSpan = document.getElementById("lastModified");
if (lastModSpan) {
    lastModSpan.textContent = `Last Modification: ${lastMod}`;
}
