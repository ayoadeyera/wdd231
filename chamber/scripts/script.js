// --- WEATHER API ---
const apiKey = '1f6d1e828e497a70dc5efba752e83142';
const lat = 7.779735156737157;
const lon = 4.548335505634935;

// Select HTML elements
const weatherIcon = document.getElementById('weather-icon');
const currentTemp = document.getElementById('current-temp');
const weatherDesc = document.getElementById('weather-desc');
const weatherDetails = document.getElementById('weather-details');
const forecastContainer = document.getElementById('forecast-container');

async function apiFetch() {
    // Current Weather
    const urlCurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
    // 5 Day / 3 Hour Forecast
    const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

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
    if(!currentTemp || !weatherIcon) return;

    const temp = Math.round(data.main.temp);
    const high = Math.round(data.main.temp_max);
    const low = Math.round(data.main.temp_min);
    const humidity = data.main.humidity;
    
    // Convert Unix timestamps to readable time
    const sunrise = new Date(data.sys.sunrise * 1000);
    const sunset = new Date(data.sys.sunset * 1000);
    
    const formatTime = (date) => {
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${ampm}`;
    };

    currentTemp.innerHTML = `${temp}°F`;
    
    const iconsrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    const desc = data.weather[0].description;
    
    weatherIcon.setAttribute('src', iconsrc);
    weatherIcon.setAttribute('alt', desc);
    
    if(weatherDesc) {
        weatherDesc.textContent = desc.replace(/\b\w/g, l => l.toUpperCase());
    }

    // Display additional weather details
    if(weatherDetails) {
        weatherDetails.innerHTML = `
            <p>High: ${high}°F</p>
            <p>Low: ${low}°F</p>
            <p>Humidity: ${humidity}%</p>
            <p>Sunrise: ${formatTime(sunrise)}</p>
            <p>Sunset: ${formatTime(sunset)}</p>
        `;
    }
}

function displayForecast(data) {
    if(!forecastContainer) return;

    forecastContainer.innerHTML = '';

    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Get today's date to find next 3 days
    const today = new Date();
    const forecasts = [];
    
    // Filter to find entries at noon for the next 3 days
    const noonForecasts = data.list.filter(x => x.dt_txt.includes('12:00:00'));
    
    // Get up to 3 forecasts
    for(let i = 0; i < Math.min(3, noonForecasts.length); i++) {
        const day = noonForecasts[i];
        const d = new Date(day.dt_txt);
        const dayName = weekdays[d.getDay()];
        const temp = Math.round(day.main.temp);
        
        forecasts.push({ dayName, temp });
    }

    // Display forecasts
    forecasts.forEach((forecast, index) => {
        const card = document.createElement('div');
        card.classList.add('forecast-card');
        
        let displayText;
        if(index === 0) {
            displayText = `Today: ${forecast.temp}°F`;
        } else {
            displayText = `${forecast.dayName}: ${forecast.temp}°F`;
        }
        
        card.innerHTML = `<p>${displayText}</p>`;
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
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Filter Gold and Silver members
        const eligibleMembers = data.filter(member => 
            member.membership_level === 'Gold' || member.membership_level === 'Silver'
        );
        
        // Shuffle array using Fisher-Yates algorithm
        for (let i = eligibleMembers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [eligibleMembers[i], eligibleMembers[j]] = [eligibleMembers[j], eligibleMembers[i]];
        }

        // Pick top 3
        const selectedMembers = eligibleMembers.slice(0, 3);

        displaySpotlights(selectedMembers);
    } catch (error) {
        console.error('Error fetching spotlight members:', error);
    }
}

function displaySpotlights(members) {
    if (!spotlightContainer) return;

    spotlightContainer.innerHTML = '';

    members.forEach(member => {
        const card = document.createElement('div');
        card.classList.add('spotlight-card');
        
        card.innerHTML = `
            <img src="${member.image}" alt="${member.name} Logo">
            <div class="spotlight-info">
                <h4>${member.name}</h4>
                <p>${member.address}</p>
                <p>${member.phone}</p>
                <p><a href="${member.website}" target="_blank">${member.website}</a></p>
                <p class="membership-level">Membership: ${member.membership_level}</p>
            </div>
        `;
        spotlightContainer.appendChild(card);
    });
}

if (spotlightContainer) {
    getSpotlights();
}