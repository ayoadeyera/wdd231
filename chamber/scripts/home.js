const currentTemp = document.querySelector('#current-temp');
const weatherIcon = document.querySelector('#weather-icon');
const captionDesc = document.querySelector('figcaption');
const forecastContainer = document.querySelector('#forecast');

const url = 'https://api.openweathermap.org/data/2.5/weather?lat=7.7797&lon=4.5483&appid=1f6d1e828e497a70dc5efba752e83142&units=metric';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=7.7797&lon=4.5483&appid=1f6d1e828e497a70dc5efba752e83142&units=metric';

// --- WEATHER SECTION ---
async function apiFetch() {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            displayResults(data);
        } else {
            throw Error(await response.text());
        }
        
        // Fetch Forecast
        const forecastResponse = await fetch(forecastUrl);
        if (forecastResponse.ok) {
            const forecastData = await forecastResponse.json();
            displayForecast(forecastData);
        }
    } catch (error) {
        console.log(error);
    }
}

function displayResults(data) {
    currentTemp.innerHTML = `${Math.round(data.main.temp)}&deg;C`;
    const iconsrc = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    let desc = data.weather[0].description;
    
    // Capitalize first letter of each word
    desc = desc.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    weatherIcon.setAttribute('src', iconsrc);
    weatherIcon.setAttribute('alt', desc);
    captionDesc.textContent = desc;
}

function displayForecast(data) {
    // Filter the list to get one reading per day (e.g., near noon: 12:00:00)
    // The API returns data every 3 hours.
    const dailyForecasts = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 3);

    forecastContainer.innerHTML = ''; // Clear loading text

    dailyForecasts.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        const temp = Math.round(day.main.temp);
        
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('forecast-day');
        dayDiv.innerHTML = `
            <p class="day-name">${dayName}</p>
            <p class="day-temp">${temp}&deg;C</p>
        `;
        forecastContainer.appendChild(dayDiv);
    });
}

apiFetch();


// --- SPOTLIGHT SECTION ---
const membersUrl = 'data/members.json';
const spotlightContainer = document.querySelector('#spotlights');

async function getSpotlights() {
    try {
        const response = await fetch(membersUrl);
        const data = await response.json();
        
        // Filter for Gold (2) or Platinum (3) members
        const qualifiedMembers = data.filter(member => 
            member.membership_level === 'Gold' || member.membership_level === 'Platinum'
        );

        // Shuffle and slice to get 2 or 3 random members
        const shuffled = qualifiedMembers.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3); // Display up to 3

        displaySpotlights(selected);

    } catch (error) {
        console.error('Error fetching members:', error);
    }
}

function displaySpotlights(members) {
    spotlightContainer.innerHTML = '';
    
    members.forEach(member => {
        const card = document.createElement('div');
        card.classList.add('spotlight-card');
        
        card.innerHTML = `
            <div class="spotlight-header">
                <h3>${member.name}</h3>
                <span class="tag">${member.membership_level} Member</span>
            </div>
            <img src="${member.image}" alt="${member.name} Logo" loading="lazy" width="100" height="auto">
            <p class="spotlight-info">"${member.other_info}"</p>
            <hr>
            <div class="spotlight-contact">
                <p>📞 ${member.phone}</p>
                <p>📍 ${member.address}</p>
                <a href="${member.website}" target="_blank">Visit Website</a>
            </div>
        `;
        
        spotlightContainer.appendChild(card);
    });
}

getSpotlights();