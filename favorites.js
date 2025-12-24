// Favorites functionality - placeholder for future implementation
console.log('Favorites module loaded');
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('favoritesGrid');
    const favoriteIds = JSON.parse(localStorage.getItem('favorites')) || [];

    // We use the same data structure found in your places.js
    const allPlaces = [
        { id: 1, name: "Tawlet Beirut", location: "Beirut", image: "https://via.placeholder.com/400x300" },
        { id: 2, name: "Jeita Grotto", location: "Byblos", image: "https://via.placeholder.com/400x300" }
        // Note: You can copy the full 'placesData' array from places.js here
    ];

    const saved = allPlaces.filter(p => favoriteIds.includes(p.id));

    if (saved.length === 0) {
        grid.innerHTML = "<p>No favorites saved yet!</p>";
    } else {
        saved.forEach(place => {
            grid.innerHTML += `
                <div class="place-card">
                    <img src="${place.image}">
                    <h3>${place.name}</h3>
                    <p>${place.location}</p>
                </div>`;
        });
    }
});