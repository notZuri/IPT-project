// Ian Christian F. Amistoso 
// LFCA322A012 
// IPT1 API PROJECT 

const weatherApiKey = "c0d5ae6a7db44ff4a144b9726a224648"; 
const newsApiKey = "70f1b191bd4d5ec6089b52dafc9b3716"; // Updated GNews API Key

// Autocomplete Function for City Search
async function autoCompleteCity() {
    const query = document.getElementById("cityInput").value.trim();
    if (query.length < 2) { 
        document.getElementById("citySuggestions").innerHTML = '';
        return;
    }

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/find?q=${query},PH&appid=${weatherApiKey}`);
        const data = await response.json();

        if (data.list && data.list.length > 0) { 
            const suggestions = data.list.map(city => {
                return `<div onclick="selectCity('${city.name}, ${city.sys.country}')" class="suggestion-item p-2 cursor-pointer hover:bg-blue-100">${city.name}, ${city.sys.country}</div>`;
            }).join('');
            document.getElementById("citySuggestions").innerHTML = suggestions;
        } else {
            document.getElementById("citySuggestions").innerHTML = '<div class="p-2 text-gray-500">No results found</div>';
        }
    } catch (error) {
        console.error("Error fetching city suggestions:", error);
    }
}

// Select a City from Suggestions
function selectCity(cityName) {
    document.getElementById("cityInput").value = cityName; 
    document.getElementById("citySuggestions").innerHTML = ''; 
    getWeather(); 
}

// Fetch Weather Data for the Selected City
async function getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    if (!city) {
        alert("Please enter a city.");
        return;
    }

    try {
        showLoading("weatherResult"); 
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`
        );
        const data = await response.json();
        
        if (data.cod !== 200) {
            document.getElementById("weatherResult").innerHTML = `<p class="text-red-500">❌ City not found!</p>`;
            return;
        }

        displayWeather(data); 
    } catch (error) {
        console.error("Weather Error:", error);
    }
}

// Display Weather Data on the Page
function displayWeather(data) {
    document.getElementById("weatherResult").innerHTML = `
        <div class="bg-white p-4 rounded-md shadow-md">
            <h3 class="text-lg font-semibold">${data.name}</h3>
            <p>${data.main.temp}°C - ${data.weather[0].description}</p>
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="Weather Icon">
        </div>
    `;
}

// Fetch News Articles by Category or Search Query using GNews API
async function fetchNews(category = "general", query = "") {
    try {
        showLoading("newsContainer"); 
        const url = query 
            ? `https://gnews.io/api/v4/search?q=${query}&token=${newsApiKey}&lang=en&max=5`
            : `https://gnews.io/api/v4/top-headlines?category=${category}&token=${newsApiKey}&lang=en&max=5`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (!data.articles || data.articles.length === 0) { 
            document.getElementById("newsContainer").innerHTML = `<p class="text-red-500">❌ No news available.</p>`;
            return;
        }

        displayNews(data.articles); 
    } catch (error) {
        console.error("News Fetch Error:", error);
    }
}

// Search News Function
function searchNews() {
    const query = document.getElementById("newsInput").value.trim();
    if (query) {
        fetchNews("", query);
    }
}

// Display News Data on the Page
function displayNews(articles) {
    const newsContainer = document.getElementById("newsContainer");
    newsContainer.innerHTML = "";

    articles.forEach(article => { 
        const newsCard = document.createElement("div");
        newsCard.classList.add("news-card", "bg-gray-100", "p-4", "rounded-md", "mt-3", "shadow-md", "transition-all", "hover:scale-105");
        newsCard.innerHTML = `
            <p><strong>${article.title}</strong></p>
            <p>${article.description || "No description available."}</p>
            <a href="${article.url}" target="_blank" class="text-blue-500">Read More</a>
        `;
        newsContainer.appendChild(newsCard);
    });
}

// Show Loading Spinner
function showLoading(elementId) {
    document.getElementById(elementId).innerHTML = `
        <div class="spinner mx-auto my-4"></div>
    `;
}

// Insert News Search Bar Inside News Section
window.onload = () => {
    fetchNews();
    
    const newsSection = document.querySelector("section.bg-white:last-of-type");
    const searchContainer = document.createElement("div");
    searchContainer.classList.add("flex", "gap-3", "mt-3", "relative");
    searchContainer.innerHTML = `
        <input type="text" id="newsInput" placeholder="Search news..." 
            class="flex-1 p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Search news">
        <button onclick="searchNews()" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:scale-105 transition-all">
            🔍 Search
        </button>
    `;
    newsSection.insertBefore(searchContainer, newsSection.children[1]);
};
