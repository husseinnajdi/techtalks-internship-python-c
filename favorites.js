// Get favorites from localStorage
const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Import places data (this would be from a database)
const placesData = [
    {
        id: 1,
        name: "Tawlet Beirut",
        category: "restaurant",
        location: "beirut",
        price: "moderate",
        priceDisplay: "$$",
        image: "https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Tawlet+Beirut",
        description: "A unique farm-to-table restaurant showcasing authentic Lebanese cuisine."
    },
    {
        id: 2,
        name: "Jeita Grotto",
        category: "nature",
        location: "byblos",
        price: "budget",
        priceDisplay: "$",
        image: "https://via.placeholder.com/400x300/4ECDC4/FFFFFF?text=Jeita+Grotto",
        description: "A stunning natural wonder featuring spectacular limestone caves."
    },
    {
        id: 3,
        name: "Café Younes",
        category: "cafe",
        location: "beirut",
        price: "budget",
        priceDisplay: "$",
        image: "https://via.placeholder.com/400x300/95E1D3/333333?text=Cafe+Younes",
        description: "Historic coffee roastery and café serving the finest Lebanese coffee since 1935."
    }
    
];

const favoritesGrid = document.getElementById('favoritesGrid');
const emptyFavorites = document.getElementById('emptyFavorites');
const favoritesCount = document.getElementById('favoritesCount');

// Display favorites
function displayFavorites() {
    const favoritePlaces = placesData.filter(place => favorites.includes(place.id));
    
    favoritesCount.textContent = favoritePlaces.length;
    
    if (favoritePlaces.length === 0) {
        emptyFavorites.style.display = 'block';
        favoritesGrid.style.display = 'none';
        return;
    }
    
    emptyFavorites.style.display = 'none';
    favoritesGrid.style.display = 'grid';
    favoritesGrid.innerHTML = '';
    
    favoritePlaces.forEach(place => {
        const card = document.createElement('div');
        card.className = 'place-card';
        card.innerHTML = `
            <button class="remove-favorite" data-id="${place.id}">✕</button>
            <img src="${place.image}" alt="${place.name}">
            <div class="place-card-content">
                <h3>${place.name}</h3>
                <span class="place-category">${getCategoryName(place.category)}</span>
                <p class="place-location">${getLocationName(place.location)}</p>
                <p class="place-price">${place.priceDisplay}</p>
            </div>
        `;
        
        // Click on card to view details
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('remove-favorite')) {
                window.location.href = `places.html?place=${place.id}`;
            }
        });
        
        favoritesGrid.appendChild(card);
    });
    
    // Add remove functionality
    document.querySelectorAll('.remove-favorite').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            removeFavorite(id);
        });
    });
}

// Remove from favorites
function removeFavorite(id) {
    const index = favorites.indexOf(id);
    if (index > -1) {
        favorites.splice(index, 1);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayFavorites();
        
        // Show notification
        showNotification('Removed from favorites');
    }
}

// Helper functions
function getCategoryName(category) {
    const categories = {
        'restaurant': 'Restaurant',
        'cafe': 'Café',
        'historical': 'Historical Site',
        'nature': 'Nature & Outdoors',
        'entertainment': 'Entertainment'
    };
    return categories[category] || category;
}

function getLocationName(location) {
    const locations = {
        'beirut': 'Beirut',
        'tripoli': 'Tripoli',
        'batroun': 'Batroun',
        'byblos': 'Byblos',
        'saida': 'Saida',
        'tyre': 'Tyre',
        'baalbek': 'Baalbek'
    };
    return locations[location] || location;
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, var(--accent-gold), var(--brown-light));
        color: var(--text-dark);
        padding: 15px 25px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        z-index: 10001;
        font-weight: 600;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        notification.style.transition = 'all 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Initialize
displayFavorites();
