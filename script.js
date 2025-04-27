// URLs for Finnkino API
const theatersURL = 'https://www.finnkino.fi/xml/TheatreAreas/';
const scheduleURL = 'https://www.finnkino.fi/xml/Schedule/?area=';

// DOM Elements
const theaterSelect = document.getElementById('theater-select');
const searchInput = document.getElementById('search');
const moviesContainer = document.getElementById('movies-container');

// Fetch the list of theaters from Finnkino
fetch(theatersURL)
    .then(response => response.text())
    .then(data => {
        // Parse XML to DOM
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, 'text/xml');
        const areas = xml.getElementsByTagName('TheatreArea');

        // Loop through each theater and add as an option to the dropdown
        for (let area of areas) {
            const id = area.getElementsByTagName('ID')[0].textContent;
            const name = area.getElementsByTagName('Name')[0].textContent;
            const option = document.createElement('option');
            option.value = id;
            option.textContent = name;
            theaterSelect.appendChild(option);
        }
    });

// Event handler for theater selection
theaterSelect.addEventListener('change', () => {
    const areaId = theaterSelect.value;
    const searchTitle = searchInput.value.toLowerCase();
    fetchSchedule(areaId, searchTitle);
});

// Event handler for search input
searchInput.addEventListener('input', () => {
    const areaId = theaterSelect.value;
    const searchTitle = searchInput.value.toLowerCase();
    if (areaId) {
        fetchSchedule(areaId, searchTitle);
    }
});

// Function to fetch the schedule for selected theater
function fetchSchedule(areaId, filterTitle) {
    fetch(scheduleURL + areaId)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(data, 'text/xml');
            const shows = xml.getElementsByTagName('Show');

            // Clear existing movie content
            moviesContainer.innerHTML = '';

            // Loop through each movie showtime and display if matches
            for (let show of shows) {
                const title = show.getElementsByTagName('Title')[0].textContent;

                // Filter by title if search is provided
                if (filterTitle && !title.toLowerCase().includes(filterTitle)) continue;

                const image = show.getElementsByTagName('EventSmallImagePortrait')[0].textContent;
                const startTime = show.getElementsByTagName('dttmShowStart')[0].textContent;
                const genres = show.getElementsByTagName('Genres')[0]?.textContent || 'N/A';

                const movieDiv = document.createElement('div');
                movieDiv.className = 'movie';

                // Image element
                const img = document.createElement('img');
                img.src = image;

                // Movie info container
                const info = document.createElement('div');
                info.className = 'movie-info';
                info.innerHTML = `<h2>${title}</h2>
                                  <p><strong>Start Time:</strong> ${startTime}</p>
                                  <p><strong>Genres:</strong> ${genres}</p>`;

                // Append elements to the DOM
                movieDiv.appendChild(img);
                movieDiv.appendChild(info);
                moviesContainer.appendChild(movieDiv);
            }
        });
}
