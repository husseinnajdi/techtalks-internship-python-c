// Places data with coordinates
const mapPlacesData = [
    {
        id: 1,
        name: "Tawlet Beirut",
        category: "restaurant",
        location: "Beirut",
        price: "$$",
        coordinates: { lat: 33.8886, lng: 35.4955 },
        description: "Farm-to-table Lebanese cuisine"
    },
    {
        id: 2,
        name: "Jeita Grotto",
        category: "nature",
        location: "Jeita",
        price: "$",
        coordinates: { lat: 33.9478, lng: 35.6383 },
        description: "Stunning limestone caves"
    },
    {
        id: 3,
        name: "Café Younes",
        category: "cafe",
        location: "Beirut",
        price: "$",
        coordinates: { lat: 33.8938, lng: 35.5018 },
        description: "Historic coffee roastery since 1935"
    },
    {
        id: 4,
        name: "Baalbek Ruins",
        category: "historical",
        location: "Baalbek",
        price: "Free",
        coordinates: { lat: 34.0059, lng: 36.2039 },
        description: "Ancient Roman temple complex"
    },
    {
        id: 5,
        name: "Skybar Beirut",
        category: "entertainment",
        location: "Beirut",
        price: "$$$",
        coordinates: { lat: 33.9021, lng: 35.5040 },
        description: "Rooftop lounge with stunning views"
    },
    {
        id: 6,
        name: "Byblos Old Souk",
        category: "historical",
        location: "Byblos",
        price: "Free",
        coordinates: { lat: 34.1208, lng: 35.6481 },
        description: "Ancient marketplace"
    },
    {
        id: 7,
        name: "Eddé Sands",
        category: "nature",
        location: "Byblos",
        price: "$$",
        coordinates: { lat: 34.0739, lng: 35.6206 },
        description: "Beautiful beach resort"
    },
    {
        id: 8,
        name: "Em Nazih",
        category: "restaurant",
        location: "Tripoli",
        price: "$",
        coordinates: { lat: 34.4367, lng: 35.8497 },
        description: "Authentic Tripoli cuisine"
    },
    {
        id: 9,
        name: "Tyre Hippodrome",
        category: "historical",
        location: "Tyre",
        price: "Free",
        coordinates: { lat: 33.2704, lng: 35.2038 },
        description: "Ancient Roman hippodrome"
    },
    {
        id: 10,
        name: "Pierre & Friends",
        category: "cafe",
        location: "Batroun",
        price: "$$",
        coordinates: { lat: 34.2548, lng: 35.6569 },
        description: "Seaside café with stunning views"
    }
];

// Initialize map
let map;
let markers = [];
let currentCategory = 'all';

// Category colors for pins
const categoryColors = {
    restaurant: '#FF6B6B',
    cafe: '#95E1D3',
    historical: '#F38181',
    nature: '#4ECDC4',
    entertainment: '#AA96DA',
    all: '#D4B87A'
};

// Initialize the map
function initMap() {
    // Hide loading message
    document.getElementById('loadingMap').style.display = 'none';
    
    // Center on Lebanon
    map = L.map('map').setView([33.8547, 35.8623], 9);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);

    // Add all markers
    addMarkers();
}

// Add markers to map
function addMarkers(category = 'all') {
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    // Filter places by category
    const filteredPlaces = category === 'all' 
        ? mapPlacesData 
        : mapPlacesData.filter(place => place.category === category);

    // Add markers for filtered places
    filteredPlaces.forEach(place => {
        // Create custom icon
        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="
                background-color: ${categoryColors[place.category]};
                width: 30px;
                height: 30px;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                border: 3px solid white;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            "></div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 30]
        });

        // Create marker
        const marker = L.marker([place.coordinates.lat, place.coordinates.lng], { icon })
            .addTo(map);

        // Create popup content
        const popupContent = `
            <div class="popup-content">
                <h3>${place.name}</h3>
                <p><strong>📍 ${place.location}</strong></p>
                <p>${place.description}</p>
                <p style="color: #4caf50; font-weight: bold;">💰 ${place.price}</p>
                <a href="places.html?place=${place.id}" class="popup-view-btn">View Details</a>
            </div>
        `;

        marker.bindPopup(popupContent);
        markers.push(marker);
    });

    // Fit map to show all markers
    if (markers.length > 0) {
        const group = L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
    }
}

// Filter button functionality
document.querySelectorAll('.map-filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Remove active class from all buttons
        document.querySelectorAll('.map-filter-btn').forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Get category and filter markers
        const category = this.dataset.category;
        currentCategory = category;
        addMarkers(category);
    });
});

// Check if user has location permission, add "My Location" marker
function addUserLocationMarker() {
    const userLocation = JSON.parse(localStorage.getItem('userLocation') || 'null');
    
    if (userLocation) {
        // Create special icon for user location
        const userIcon = L.divIcon({
            className: 'user-marker',
            html: `<div style="
                background-color: #2196F3;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 4px solid white;
                box-shadow: 0 4px 12px rgba(33, 150, 243, 0.5);
                animation: pulse 2s infinite;
            "></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        const userMarker = L.marker([userLocation.latitude, userLocation.longitude], { icon: userIcon })
            .addTo(map)
            .bindPopup('<div style="text-align: center;"><strong>📍 You are here</strong></div>');
    }
}

// Add CSS for pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(1.2);
            opacity: 0.7;
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Initialize map when page loads
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initMap();
        addUserLocationMarker();
    }, 100);
});