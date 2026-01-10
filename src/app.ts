interface WeatherData {
    current: {
        temperature_2m: number;
        apparent_temperature: number;
        relative_humidity_2m: number;
        precipitation: number;
        wind_speed_10m: number;
        weather_code: number;
    };
    daily: {
        time: string[];
        weather_code: number[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
    };
    hourly: {
        time: string[];
        temperature_2m: number[];
        weather_code: number[];
    };
}

// State
let currentCity = "Amman";
let cachedWeatherData: WeatherData | null = null;
let tempUnit = localStorage.getItem('tempUnit') || "celsius";
let windUnit = localStorage.getItem('windUnit') || "kmh";
let precipUnit = localStorage.getItem('precipUnit') || "mm";


//elements
const searchInput = document.querySelector('.searchInput') as HTMLInputElement;
const searchBtn = document.querySelector('.searchBtn') as HTMLButtonElement;
const unitsToggleBtn = document.getElementById('unitsToggleBtn') as HTMLButtonElement;
const unitsDropdown = document.getElementById('unitsDropdown') as HTMLElement;
const resetUnitsBtn = document.getElementById('resetUnitsBtn') as HTMLButtonElement;
const unitItems = document.querySelectorAll('.unitItem') as NodeListOf<HTMLElement>;
const dailyRow = document.querySelector('.dailyRow') as HTMLElement;
const hourList = document.querySelector('.hourList') as HTMLElement;
const daySelectBtn = document.querySelector('.daySelectBtn') as HTMLButtonElement;
const daySelectList = document.querySelector('.daySelectList') as HTMLElement;
const dayOptions = document.querySelectorAll('.dayOption') as NodeListOf<HTMLElement>;
const selectedDayLabel = document.getElementById('selectedDayLabel') as HTMLElement;


// Loader elements
const currentLoader = document.getElementById('currentLoader') as HTMLElement;
const dailyLoader = document.getElementById('dailyLoader') as HTMLElement;
const hourlyLoader = document.getElementById('hourlyLoader') as HTMLElement;


function getWeatherIcon(code: number): string {
    const base = "assets/images/";
    if (code === 0) return base + "icon-sunny.webp";
    if (code >= 1 && code <= 3) return base + "icon-partly-cloudy.webp";
    if (code >= 45 && code <= 48) return base + "icon-fog.webp";
    if (code >= 51 && code <= 67) return base + "icon-rain.webp";
    if (code >= 71 && code <= 77) return base + "icon-snow.webp"; 
    if (code >= 80 && code <= 82) return base + "icon-rain.webp";
    if (code >= 95) return base + "icon-storm.webp";
    return base + "icon-overcast.webp";
}


function clearElement(el: HTMLElement) {
    while (el.firstChild) el.removeChild(el.firstChild);
}


function updateUnitsUI(): void {
    unitItems.forEach(item => {
        const unit = item.dataset.unit;
        const type = item.dataset.unitType;
        item.classList.toggle('active', 
            (type === 'temp' && unit === tempUnit) || 
            (type === 'wind' && unit === windUnit) || 
            (type === 'precip' && unit === precipUnit)
        );
    });
}


async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
    const baseUrl = "https://api.open-meteo.com/v1/forecast";
    const coords = `?latitude=${lat}&longitude=${lon}`;
    const currentFields = "&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,wind_speed_10m,weather_code";
    const hourlyFields = "&hourly=temperature_2m,weather_code";
    const dailyFields = "&daily=weather_code,temperature_2m_max,temperature_2m_min";
    const timezone = "&timezone=auto";

    const tempParam = tempUnit === "fahrenheit" ? "&temperature_unit=fahrenheit" : "";
    const windParam = windUnit === "mph" ? "&wind_speed_unit=mph" : "";
    const precipParam = precipUnit === "inch" ? "&precipitation_unit=inch" : "";
    
    const url = `${baseUrl}${coords}${currentFields}${hourlyFields}${dailyFields}${timezone}${tempParam}${windParam}${precipParam}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Weather API request failed");
    return await response.json();
}

function showCurrentCard(data: WeatherData, city: string) {
    cachedWeatherData = data;
    currentLoader.style.display = 'none';

    (document.querySelector('.placeName') as HTMLElement).textContent = city;
    (document.querySelector('.temperatureDegree') as HTMLElement).textContent = `${Math.round(data.current.temperature_2m)}°`;
    (document.querySelector('.currentDate') as HTMLElement).textContent = new Date().toDateString();

    const wLabel = windUnit === 'kmh' ? 'km/h' : 'mph';
    (document.getElementById('feelsLikeValue') as HTMLElement).textContent = `${Math.round(data.current.apparent_temperature)}°`;
    (document.getElementById('humidityValue') as HTMLElement).textContent = `${data.current.relative_humidity_2m}%`;
    (document.getElementById('windSpeedValue') as HTMLElement).textContent = `${data.current.wind_speed_10m} ${wLabel}`;
    (document.getElementById('precipValue') as HTMLElement).textContent = `${data.current.precipitation} ${precipUnit}`;
}

function showDailyForecast(data: WeatherData) {
    dailyLoader.style.display = 'none';
    clearElement(dailyRow);
    
    data.daily.time.forEach((date, index) => {
        const div = document.createElement('div');
        div.className = 'dailyTemp';
        const p = document.createElement('p');
        p.className = 'dailyTempDay';
        p.textContent = new Date(date).toLocaleDateString([], { weekday: 'short' });

        const img = document.createElement('img');
        img.src = getWeatherIcon(data.daily.weather_code[index]);
        img.className = 'dailyTempImage';

        const morningSpan = document.createElement('span');
        morningSpan.className = 'morningTemp';
        morningSpan.textContent = `${Math.round(data.daily.temperature_2m_min[index])}°`;

        const nightSpan = document.createElement('span');
        nightSpan.className = 'nightTemp';
        nightSpan.textContent = `${Math.round(data.daily.temperature_2m_max[index])}°`;

        const wrapper = document.createElement('div');
        wrapper.className = 'dailyTempValues';
    
        wrapper.append(morningSpan, nightSpan);
        div.append(p, img, wrapper);
        dailyRow.appendChild(div);
    });
}

function showHourlyForecast(dayIndex: number) {
    hourlyLoader.style.display = 'none';
    if (!cachedWeatherData) return;
    clearElement(hourList);

    const start = dayIndex * 24;
    for (let i = start; i < start + 24; i++) {
        const hourBox = document.createElement('div');
        hourBox.className = 'hourBox';
        const wrapper = document.createElement('div');
        wrapper.className = 'warperTimeIcon';

        const img = document.createElement('img');
        img.className = 'hourImage';
        img.src = getWeatherIcon(cachedWeatherData.hourly.weather_code[i]);

        const timeP = document.createElement('p');
        timeP.className = 'hourTimeLabel';
        timeP.textContent = new Date(cachedWeatherData.hourly.time[i]).toLocaleTimeString([], { hour: 'numeric', hour12: true }).toUpperCase();

        const tempSpan = document.createElement('span');
        tempSpan.className = 'hourlyTempDegree';
        tempSpan.textContent = `${Math.round(cachedWeatherData.hourly.temperature_2m[i])}°`;

        wrapper.append(img, timeP);
        hourBox.append(wrapper, tempSpan);
        hourList.appendChild(hourBox);
    }
}

function updateUI(data: WeatherData, city: string) {
    showCurrentCard(data, city);
    showDailyForecast(data);
    showHourlyForecast(0);
    
}

async function displayWeatherForCity() {
    const cityInput = searchInput.value.trim() || currentCity;

    // Show all loaders
    currentLoader.style.display = 'flex';
    dailyLoader.style.display = 'flex';
    hourlyLoader.style.display = 'flex';

    try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityInput)}&count=1&language=en&format=json`);
        const geo = await res.json();
        
        
        if (geo.results && geo.results.length > 0) {
            const result = geo.results[0];
            currentCity = `${result.name}, ${result.country}`;

            const weather = await fetchWeather(result.latitude, result.longitude);
            updateUI(weather, currentCity);
        }
    } catch (e) {
        console.error(e);
    }
}

resetUnitsBtn.addEventListener('click', () => {
    tempUnit = 'celsius';
    windUnit = 'kmh';
    precipUnit = 'mm';

    localStorage.setItem('tempUnit', tempUnit);
    localStorage.setItem('windUnit', windUnit);
    localStorage.setItem('precipUnit', precipUnit);

    updateUnitsUI();
    if (cachedWeatherData) updateUI(cachedWeatherData, currentCity);
});

unitItems.forEach(item => {
    item.addEventListener('click', () => {
        const unit = item.dataset.unit!;
        const type = item.dataset.unitType!;
        if (type === 'temp') tempUnit = unit;
        else if (type === 'wind') windUnit = unit;
        else if (type === 'precip') precipUnit = unit;

        localStorage.setItem(type + 'Unit', unit);
        updateUnitsUI();

        if (cachedWeatherData) updateUI(cachedWeatherData, currentCity);
    });
});


dayOptions.forEach((options, index) => {
    options.addEventListener('click', () => {
        dayOptions.forEach(o => o.classList.remove('active'));
        options.classList.add('active');
        selectedDayLabel.textContent = options.textContent;
        showHourlyForecast(index);       
    });
});



searchBtn.addEventListener('click', () => displayWeatherForCity());
searchInput.addEventListener('keydown', (e) => { 
    if (e.key === 'Enter')
        displayWeatherForCity();
});

unitsToggleBtn.addEventListener('click', (e) => { 
    e.stopPropagation();
    unitsDropdown.classList.toggle('show');
});
daySelectBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    daySelectList.classList.toggle('show');
});

document.addEventListener('click', () => {
    unitsDropdown.classList.remove('show');
    daySelectList.classList.remove('show');
});


updateUnitsUI();
displayWeatherForCity();
