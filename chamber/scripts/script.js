// 1. Dynamic Copyright Year
const currentYear = new Date().getFullYear();
document.getElementById("currentYear").textContent = currentYear;

// 2. Last Modified Date
let lastMod = document.lastModified;
document.getElementById("lastModified").textContent = `Last Modification: ${lastMod}`;