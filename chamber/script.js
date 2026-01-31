// --- WEATHER API ---
const apiKey = '1f6d1e828e497a70dc5efba752e83142';
const lat = 7.7797;
const lon = 4.5483;

// Select HTML elements
const weatherIcon = document.getElementById('weather-icon');
const currentTemp = document.getElementById('current-temp');
const weatherDesc = document.getElementById('weather-desc');
const forecastContainer = document.getElementById('forecast-container');

async function apiFetch() {
    // Current Weather
    const urlCurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    // 5 Day / 3 Hour Forecast
    const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    try {
        const responseCurrent = await fetch(urlCurrent);
        if (responseCurrent.ok) {
            const dataCurrent = await responseCurrent.json();
            displayCurrentWeather(dataCurrent);
        } else {
            throw Error(await responseCurrent.text());
        }

        const responseForecast = await fetch(urlForecast);
        if (responseForecast.ok) {
            const dataForecast = await responseForecast.json();
            displayForecast(dataForecast);
        } else {
            throw Error(await responseForecast.text());
        }

    } catch (error) {
        console.log(error);
    }
}

function displayCurrentWeather(data) {
    if(!currentTemp || !weatherIcon || !weatherDesc) return;

    currentTemp.innerHTML = `${Math.round(data.main.temp)}`;
    const iconsrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    const desc = data.weather[0].description;
    
    weatherIcon.setAttribute('src', iconsrc);
    weatherIcon.setAttribute('alt', desc);
    weatherDesc.textContent = desc.replace(/\b\w/g, l => l.toUpperCase());
}

function displayForecast(data) {
    if(!forecastContainer) return;

    forecastContainer.innerHTML = ''; // Clear previous

    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Filter to find entries that contain "12:00:00" for the next 3 days
    const threeDayForecast = data.list.filter(x => x.dt_txt.includes('12:00:00')).slice(0, 3);

    threeDayForecast.forEach(day => {
        const d = new Date(day.dt_txt);
        const dayName = weekdays[d.getDay()];
        const temp = Math.round(day.main.temp);
        const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
        const desc = day.weather[0].description;

        const card = document.createElement('div');
        card.classList.add('forecast-card');
        card.innerHTML = `
            <p class="forecast-day">${dayName}</p>
            <img src="${icon}" alt="${desc}">
            <p class="forecast-temp">${temp}&deg;C</p>
        `;
        forecastContainer.appendChild(card);
    });
}

// Check if we are on the home page before calling fetch
if (document.getElementById('current-temp')) {
    apiFetch();
}

// --- SPOTLIGHTS ---
const spotlightContainer = document.getElementById('spotlight-container');

async function getSpotlights() {
    const response = await fetch('data/members.json');
    const data = await response.json();
    
    // Filter Gold (3) and Silver (2) members
    const eligibleMembers = data.filter(member => member.membershipLevel === 3 || member.membershipLevel === 2);
    
    // Shuffle
    for (let i = eligibleMembers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [eligibleMembers[i], eligibleMembers[j]] = [eligibleMembers[j], eligibleMembers[i]];
    }

    // Pick top 2 or 3
    const selectedMembers = eligibleMembers.slice(0, 3);

    displaySpotlights(selectedMembers);
}

function displaySpotlights(members) {
    if (!spotlightContainer) return;

    spotlightContainer.innerHTML = '';

    members.forEach(member => {
        const card = document.createElement('div');
        card.classList.add('spotlight-card');
        
        card.innerHTML = `
            <h3>${member.name}</h3>
            <img src="images/${member.image}" alt="${member.name} Logo">
            <p><strong>Email:</strong> ${member.email || 'N/A'}</p>
            <p><strong>Phone:</strong> ${member.phone}</p>
            <p class="membership-level">${member.membershipLevel === 3 ? 'Gold Member' : 'Silver Member'}</p>
            <a href="${member.website}" target="_blank">Visit Website</a>
        `;
        spotlightContainer.appendChild(card);
    });
}

if (spotlightContainer) {
    getSpotlights();
}