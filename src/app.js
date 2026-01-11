var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// State
var currentCity = "Amman";
var cachedWeatherData = null;
var tempUnit = localStorage.getItem('tempUnit') || "celsius";
var windUnit = localStorage.getItem('windUnit') || "kmh";
var precipUnit = localStorage.getItem('precipUnit') || "mm";
//elements
var searchInput = document.querySelector('.searchInput');
var searchBtn = document.querySelector('.searchBtn');
var unitsToggleBtn = document.getElementById('unitsToggleBtn');
var unitsDropdown = document.getElementById('unitsDropdown');
var resetUnitsBtn = document.getElementById('resetUnitsBtn');
var unitItems = document.querySelectorAll('.unitItem');
var dailyRow = document.querySelector('.dailyRow');
var hourList = document.querySelector('.hourList');
var daySelectBtn = document.querySelector('.daySelectBtn');
var daySelectList = document.querySelector('.daySelectList');
var dayOptions = document.querySelectorAll('.dayOption');
var selectedDayLabel = document.getElementById('selectedDayLabel');
// Loader elements
var currentLoader = document.getElementById('currentLoader');
var dailyLoader = document.getElementById('dailyLoader');
var hourlyLoader = document.getElementById('hourlyLoader');
function getWeatherIcon(code) {
    var base = "assets/images/";
    if (code === 0)
        return base + "icon-sunny.webp";
    if (code >= 1 && code <= 3)
        return base + "icon-partly-cloudy.webp";
    if (code >= 45 && code <= 48)
        return base + "icon-fog.webp";
    if (code >= 51 && code <= 67)
        return base + "icon-rain.webp";
    if (code >= 71 && code <= 77)
        return base + "icon-snow.webp";
    if (code >= 80 && code <= 82)
        return base + "icon-rain.webp";
    if (code >= 95)
        return base + "icon-storm.webp";
    return base + "icon-overcast.webp";
}
function clearElement(el) {
    while (el.firstChild)
        el.removeChild(el.firstChild);
}
function updateUnitsUI() {
    unitItems.forEach(function (item) {
        var unit = item.dataset.unit;
        var type = item.dataset.unitType;
        item.classList.toggle('active', (type === 'temp' && unit === tempUnit) ||
            (type === 'wind' && unit === windUnit) ||
            (type === 'precip' && unit === precipUnit));
    });
}
function fetchWeather(lat, lon) {
    return __awaiter(this, void 0, void 0, function () {
        var baseUrl, coords, currentFields, hourlyFields, dailyFields, timezone, tempParam, windParam, precipParam, url, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    baseUrl = "https://api.open-meteo.com/v1/forecast";
                    coords = "?latitude=".concat(lat, "&longitude=").concat(lon);
                    currentFields = "&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,wind_speed_10m,weather_code";
                    hourlyFields = "&hourly=temperature_2m,weather_code";
                    dailyFields = "&daily=weather_code,temperature_2m_max,temperature_2m_min";
                    timezone = "&timezone=auto";
                    tempParam = tempUnit === "fahrenheit" ? "&temperature_unit=fahrenheit" : "";
                    windParam = windUnit === "mph" ? "&wind_speed_unit=mph" : "";
                    precipParam = precipUnit === "inch" ? "&precipitation_unit=inch" : "";
                    url = "".concat(baseUrl).concat(coords).concat(currentFields).concat(hourlyFields).concat(dailyFields).concat(timezone).concat(tempParam).concat(windParam).concat(precipParam);
                    return [4 /*yield*/, fetch(url)];
                case 1:
                    response = _a.sent();
                    if (!response.ok)
                        throw new Error("Weather API request failed");
                    return [4 /*yield*/, response.json()];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function showCurrentCard(data, city) {
    cachedWeatherData = data;
    currentLoader.style.display = 'none';
    document.querySelector('.placeName').textContent = city;
    document.querySelector('.temperatureDegree').textContent = "".concat(Math.round(data.current.temperature_2m), "\u00B0");
    document.querySelector('.currentDate').textContent = new Date().toDateString();
    var wLabel = windUnit === 'kmh' ? 'km/h' : 'mph';
    document.getElementById('feelsLikeValue').textContent = "".concat(Math.round(data.current.apparent_temperature), "\u00B0");
    document.getElementById('humidityValue').textContent = "".concat(data.current.relative_humidity_2m, "%");
    document.getElementById('windSpeedValue').textContent = "".concat(data.current.wind_speed_10m, " ").concat(wLabel);
    document.getElementById('precipValue').textContent = "".concat(data.current.precipitation, " ").concat(precipUnit);
}
function showDailyForecast(data) {
    dailyLoader.style.display = 'none';
    clearElement(dailyRow);
    data.daily.time.forEach(function (date, index) {
        var div = document.createElement('div');
        div.className = 'dailyTemp';
        var p = document.createElement('p');
        p.className = 'dailyTempDay';
        p.textContent = new Date(date).toLocaleDateString([], { weekday: 'short' });
        var img = document.createElement('img');
        img.src = getWeatherIcon(data.daily.weather_code[index]);
        img.className = 'dailyTempImage';
        var morningSpan = document.createElement('span');
        morningSpan.className = 'morningTemp';
        morningSpan.textContent = "".concat(Math.round(data.daily.temperature_2m_min[index]), "\u00B0");
        var nightSpan = document.createElement('span');
        nightSpan.className = 'nightTemp';
        nightSpan.textContent = "".concat(Math.round(data.daily.temperature_2m_max[index]), "\u00B0");
        var wrapper = document.createElement('div');
        wrapper.className = 'dailyTempValues';
        wrapper.append(morningSpan, nightSpan);
        div.append(p, img, wrapper);
        dailyRow.appendChild(div);
    });
}
function showHourlyForecast(dayIndex) {
    hourlyLoader.style.display = 'none';
    if (!cachedWeatherData)
        return;
    clearElement(hourList);
    var start = dayIndex * 24;
    for (var i = start; i < start + 24; i++) {
        var hourBox = document.createElement('div');
        hourBox.className = 'hourBox';
        var wrapper = document.createElement('div');
        wrapper.className = 'warperTimeIcon';
        var img = document.createElement('img');
        img.className = 'hourImage';
        img.src = getWeatherIcon(cachedWeatherData.hourly.weather_code[i]);
        var timeP = document.createElement('p');
        timeP.className = 'hourTimeLabel';
        timeP.textContent = new Date(cachedWeatherData.hourly.time[i]).toLocaleTimeString([], { hour: 'numeric', hour12: true }).toUpperCase();
        var tempSpan = document.createElement('span');
        tempSpan.className = 'hourlyTempDegree';
        tempSpan.textContent = "".concat(Math.round(cachedWeatherData.hourly.temperature_2m[i]), "\u00B0");
        wrapper.append(img, timeP);
        hourBox.append(wrapper, tempSpan);
        hourList.appendChild(hourBox);
    }
}
function updateUI(data, city) {
    showCurrentCard(data, city);
    showDailyForecast(data);
    showHourlyForecast(0);
}
function displayWeatherForCity() {
    return __awaiter(this, void 0, void 0, function () {
        var cityInput, res, geo, result, weather, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cityInput = searchInput.value.trim() || currentCity;
                    // Show all loaders
                    currentLoader.style.display = 'flex';
                    dailyLoader.style.display = 'flex';
                    hourlyLoader.style.display = 'flex';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch("https://geocoding-api.open-meteo.com/v1/search?name=".concat(encodeURIComponent(cityInput), "&count=1&language=en&format=json"))];
                case 2:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 3:
                    geo = _a.sent();
                    if (!(geo.results && geo.results.length > 0)) return [3 /*break*/, 5];
                    result = geo.results[0];
                    currentCity = "".concat(result.name, ", ").concat(result.country);
                    return [4 /*yield*/, fetchWeather(result.latitude, result.longitude)];
                case 4:
                    weather = _a.sent();
                    updateUI(weather, currentCity);
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    e_1 = _a.sent();
                    console.error(e_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
resetUnitsBtn.addEventListener('click', function () {
    tempUnit = 'celsius';
    windUnit = 'kmh';
    precipUnit = 'mm';
    localStorage.setItem('tempUnit', tempUnit);
    localStorage.setItem('windUnit', windUnit);
    localStorage.setItem('precipUnit', precipUnit);
    updateUnitsUI();
    if (cachedWeatherData)
        updateUI(cachedWeatherData, currentCity);
});
unitItems.forEach(function (item) {
    item.addEventListener('click', function () {
        var unit = item.dataset.unit;
        var type = item.dataset.unitType;
        if (type === 'temp')
            tempUnit = unit;
        else if (type === 'wind')
            windUnit = unit;
        else if (type === 'precip')
            precipUnit = unit;
        localStorage.setItem(type + 'Unit', unit);
        updateUnitsUI();
        if (cachedWeatherData)
            updateUI(cachedWeatherData, currentCity);
    });
});
dayOptions.forEach(function (options, index) {
    options.addEventListener('click', function () {
        dayOptions.forEach(function (o) { return o.classList.remove('active'); });
        options.classList.add('active');
        selectedDayLabel.textContent = options.textContent;
        showHourlyForecast(index);
    });
});
searchBtn.addEventListener('click', function () { return displayWeatherForCity(); });
searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter')
        displayWeatherForCity();
});
unitsToggleBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    unitsDropdown.classList.toggle('show');
});
daySelectBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    daySelectList.classList.toggle('show');
});
document.addEventListener('click', function () {
    unitsDropdown.classList.remove('show');
    daySelectList.classList.remove('show');
});
updateUnitsUI();
displayWeatherForCity();
