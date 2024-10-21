// API configuration
const API_KEY = 'YOUR_API_KEY_HERE';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// DOM Elements
const searchForm = document.getElementById('search-form') as HTMLFormElement;
const cityInput = document.getElementById('city-input') as HTMLInputElement;
const cityName = document.getElementById('city-name') as HTMLHeadingElement;
const date = document.getElementById('date') as HTMLParagraphElement;
const temperature = document.getElementById('temperature') as HTMLSpanElement;
const weatherIcon = document.getElementById('weather-icon') as HTMLImageElement;
const weatherDescription = document.getElementById('weather-description') as HTMLParagraphElement;
const humidity = document.getElementById('humidity') as HTMLSpanElement;
const windSpeed = document.getElementById('wind-speed') as HTMLSpanElement;
const forecastContainer = document.querySelector('.forecast-container') as HTMLDivElement;

// Interfaces
interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
}

interface ForecastData {
  list: {
    dt: number;
    main: {
      temp: number;
    };
    weather: {
      icon: string;
    }[];
  }[];
}

// Event Listeners
searchForm.addEventListener('submit', (e: Event) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    getWeatherData(city);
    getForecastData(city);
  }
});

// Fetch current weather data
async function getWeatherData(city: string): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`);
    if (!response.ok) throw new Error('City not found');
    const data: WeatherData = await response.json();
    updateCurrentWeather(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    alert('Failed to fetch weather data. Please try again.');
  }
}

// Fetch forecast data
async function getForecastData(city: string): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`);
    if (!response.ok) throw new Error('City not found');
    const data: ForecastData = await response.json();
    updateForecast(data);
  } catch (error) {
    console.error('Error fetching forecast data:', error);
  }
}

// Update current weather in the UI
function updateCurrentWeather(data: WeatherData): void {
  cityName.textContent = data.name;
  date.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  temperature.textContent = Math.round(data.main.temp).toString();
  weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  weatherIcon.alt = data.weather[0].description;
  weatherDescription.textContent = data.weather[0].description;
  humidity.textContent = data.main.humidity.toString();
  windSpeed.textContent = data.wind.speed.toString();
}

// Update forecast in the UI
function updateForecast(data: ForecastData): void {
  forecastContainer.innerHTML = '';
  const dailyData = data.list.filter((reading, index) => index % 8 === 0);
  
  dailyData.forEach((day, index) => {
    if (index < 5) {
      const date = new Date(day.dt * 1000);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const temp = Math.round(day.main.temp);
      const iconCode = day.weather[0].icon;
      
      const forecastDay = document.createElement('div');
      forecastDay.classList.add('forecast-day');
      forecastDay.innerHTML = `
        <h4>${dayName}</h4>
        <img src="http://openweathermap.org/img/wn/${iconCode}.png" alt="Weather icon" class="forecast-icon">
        <p class="forecast-temp">${temp}°C</p>
      `;
      forecastContainer.appendChild(forecastDay);
    }
  });
}

// Initial call to populate with default city (e.g., London)
getWeatherData('London');
getForecastData('London');