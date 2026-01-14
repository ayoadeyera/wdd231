/**
 * DATE MODULE - Handles footer year and last modified date
 */
const currentYearElement = document.getElementById("currentyear");
const lastModifiedElement = document.getElementById("lastModified");

if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
}

if (lastModifiedElement) {
    lastModifiedElement.textContent = `Last Modification: ${document.lastModified}`;
}