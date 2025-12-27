// Places data
const placesData = [
    {
        id: 1,
        name: "Tawlet Beirut",
        category: "restaurant",
        location: "beirut",
        price: "moderate",
        priceDisplay: "$$",
        image: "https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Tawlet+Beirut",
        description: "A unique farm-to-table restaurant showcasing authentic Lebanese cuisine from different regions. Each day features a different village's traditional recipes.",
        hours: "12:00 PM - 11:00 PM",
        contact: "+961 1 448 129"
    },
    {
        id: 2,
        name: "Jeita Grotto",
        category: "nature",
        location: "Jeita",
        price: "budget",
        priceDisplay: "$",
        image: "https://via.placeholder.com/400x300/4ECDC4/FFFFFF?text=Jeita+Grotto",
        description: "A stunning natural wonder featuring spectacular limestone caves with underground rivers and breathtaking stalactite formations.",
        hours: "9:00 AM - 5:00 PM",
        contact: "+961 9 220 841"
    },
    {
        id: 3,
        name: "Café Younes",
        category: "cafe",
        location: "beirut",
        price: "budget",
        priceDisplay: "$",
        image: "https://via.placeholder.com/400x300/95E1D3/333333?text=Cafe+Younes",
        description: "Historic coffee roastery and café serving the finest Lebanese coffee since 1935. A must-visit for coffee enthusiasts.",
        hours: "7:00 AM - 8:00 PM",
        contact: "+961 1 340 871"
    },
    {
        id: 4,
        name: "Baalbek Ruins",
        category: "historical",
        location: "baalbek",
        price: "free",
        priceDisplay: "Free",
        image: "https://via.placeholder.com/400x300/F38181/FFFFFF?text=Baalbek+Ruins",
        description: "Ancient Roman temple complex and UNESCO World Heritage site, featuring some of the best-preserved Roman ruins in the world.",
        hours: "8:00 AM - 6:00 PM",
        contact: "+961 8 370 750"
    },
    {
        id: 5,
        name: "Skybar Beirut",
        category: "entertainment",
        location: "beirut",
        price: "expensive",
        priceDisplay: "$$$",
        image: "https://via.placeholder.com/400x300/AA96DA/FFFFFF?text=Skybar+Beirut",
        description: "Rooftop lounge and nightclub with stunning views of Beirut's coastline. Features international DJs and a vibrant atmosphere.",
        hours: "9:00 PM - 4:00 AM",
        contact: "+961 3 748 444"
    },
    {
        id: 6,
        name: "Byblos Old Souk",
        category: "historical",
        location: "byblos",
        price: "free",
        priceDisplay: "Free",
        image: "https://via.placeholder.com/400x300/FCBAD3/333333?text=Byblos+Souk",
        description: "Ancient marketplace in one of the oldest continuously inhabited cities in the world. Perfect for shopping traditional crafts.",
        hours: "10:00 AM - 10:00 PM",
        contact: "+961 9 540 325"
    },
    {
        id: 7,
        name: "Eddé Sands",
        category: "nature",
        location: "byblos",
        price: "moderate",
        priceDisplay: "$$",
        image: "https://via.placeholder.com/400x300/A8E6CF/333333?text=Edde+Sands",
        description: "Beautiful beach resort with crystal clear waters, water sports, and beachside dining. Perfect for a relaxing day by the sea.",
        hours: "8:00 AM - 8:00 PM",
        contact: "+961 9 540 666"
    },
    {
        id: 8,
        name: "Em Nazih",
        category: "restaurant",
        location: "tripoli",
        price: "budget",
        priceDisplay: "$",
        image: "https://via.placeholder.com/400x300/FFD93D/333333?text=Em+Nazih",
        description: "Authentic Tripoli cuisine in a traditional setting. Famous for their kibbeh and traditional sweets.",
        hours: "11:00 AM - 10:00 PM",
        contact: "+961 6 432 887"
    },
    {
        id: 9,
        name: "Tyre Hippodrome",
        category: "historical",
        location: "tyre",
        price: "free",
        priceDisplay: "Free",
        image: "https://via.placeholder.com/400x300/6BCB77/FFFFFF?text=Tyre+Hippodrome",
        description: "Ancient Roman hippodrome and archaeological site, part of the UNESCO World Heritage site of Tyre.",
        hours: "8:00 AM - 6:00 PM",
        contact: "+961 7 740 821"
    },
    {
        id: 10,
        name: "Pierre & Friends",
        category: "cafe",
        location: "batroun",
        price: "moderate",
        priceDisplay: "$$",
        image: "https://via.placeholder.com/400x300/4D96FF/FFFFFF?text=Pierre+Friends",
        description: "Charming seaside café with stunning Mediterranean views. Known for their fresh seafood and relaxed atmosphere.",
        hours: "10:00 AM - 11:00 PM",
        contact: "+961 3 870 445"
    },
    {
        id: 11,
        name: "Sidon Sea Castle",
        category: "historical",
        location: "saida",
        price: "free",
        priceDisplay: "Free",
        image: "https://via.placeholder.com/400x300/FF6B9D/FFFFFF?text=Sidon+Castle",
        description: "Crusader sea castle built in the 13th century on a small island connected to the mainland by a stone bridge.",
        hours: "8:00 AM - 6:00 PM",
        contact: "+961 7 720 549"
    },
    {
        id: 12,
        name: "The Backyard Hazmieh",
        category: "entertainment",
        location: "beirut",
        price: "moderate",
        priceDisplay: "$$",
        image: "https://via.placeholder.com/400x300/C3ACD0/333333?text=The+Backyard",
        description: "Outdoor entertainment venue with live music, food trucks, and a vibrant atmosphere. Great for families and groups.",
        hours: "5:00 PM - 1:00 AM",
        contact: "+961 5 956 777"
    }
];

// Get DOM elements
const placesGrid = document.getElementById('placesGrid');
const categoryFilter = document.getElementById('categoryFilter');
const locationFilter = document.getElementById('locationFilter');
const priceFilter = document.getElementById('priceFilter');
const searchInput = document.getElementById('searchPlaces');
const resetFilters = document.getElementById('resetFilters');
const modal = document.getElementById('placeModal');
const closeModal = document.querySelector('.close-modal');

// Comments storage (simulating database - in real app this would be server-side)
let commentsData = {
    1: [{ author: "Sarah M.", text: "Amazing food and atmosphere! Highly recommend the traditional dishes.", approved: true }],
    2: [{ author: "John D.", text: "Absolutely breathtaking! A must-visit natural wonder.", approved: true }]
};

let currentPlaceId = null;

// Display all places initially
displayPlaces(placesData);

// Search functionality
searchInput.addEventListener('input', (e) => {
    filterAndSearchPlaces();
});

// Filter functionality
function filterAndSearchPlaces() {
    const category = categoryFilter.value;
    const location = locationFilter.value;
    const price = priceFilter.value;
    const searchTerm = searchInput.value.toLowerCase();

    const filtered = placesData.filter(place => {
        const categoryMatch = category === 'all' || place.category === category;
        const locationMatch = location === 'all' || place.location === location;
        const priceMatch = price === 'all' || place.price === price;
        const searchMatch = searchTerm === '' ||
            place.name.toLowerCase().includes(searchTerm) ||
            place.description.toLowerCase().includes(searchTerm) ||
            getLocationName(place.location).toLowerCase().includes(searchTerm);

        return categoryMatch && locationMatch && priceMatch && searchMatch;
    });

    displayPlaces(filtered);
}

// Display places in grid
function displayPlaces(places) {
    placesGrid.innerHTML = '';

    if (places.length === 0) {
        placesGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; font-size: 18px; color: #666;">No places found matching your filters.</p>';
        return;
    }

    places.forEach(place => {
        const card = document.createElement('div');
        card.className = 'place-card';
        card.innerHTML = `
            <img src="${place.image}" alt="${place.name}">
            <div class="place-card-content">
                <h3>${place.name}</h3>
                <span class="place-category">${getCategoryName(place.category)}</span>
                <p class="place-location">${getLocationName(place.location)}</p>
                <p class="place-price">${place.priceDisplay}</p>
            </div>
        `;

        card.addEventListener('click', () => showPlaceDetails(place));
        placesGrid.appendChild(card);
    });
}

// Show place details in modal
function showPlaceDetails(place) {
    currentPlaceId = place.id;

    document.getElementById('modalImage').src = place.image;
    document.getElementById('modalTitle').textContent = place.name;
    document.getElementById('modalCategory').textContent = getCategoryName(place.category);
    document.getElementById('modalLocation').textContent = getLocationName(place.location);
    document.getElementById('modalPrice').textContent = `Price: ${place.priceDisplay}`;
    document.getElementById('modalDescription').textContent = place.description;
    document.getElementById('modalHours').textContent = `⏰ Hours: ${place.hours}`;
    document.getElementById('modalContact').textContent = `📞 Contact: ${place.contact}`;

    // Load comments
    loadComments(place.id);

    // Clear comment textarea
    document.getElementById('commentText').value = '';

    modal.style.display = 'block';
}

// Load comments for a place
function loadComments(placeId) {
    const commentsList = document.getElementById('commentsList');
    const comments = commentsData[placeId] || [];

    if (comments.length === 0) {
        commentsList.innerHTML = '<p class="no-comments">No comments yet. Be the first to share your experience!</p>';
        return;
    }

    commentsList.innerHTML = '';
    comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment-item';
        commentDiv.innerHTML = `
            <div class="comment-author">
                ${comment.author}
                ${!comment.approved ? '<span class="comment-pending">Pending Review</span>' : ''}
            </div>
            <div class="comment-text">${comment.text}</div>
        `;
        commentsList.appendChild(commentDiv);
    });
}

// Submit comment
document.getElementById('submitComment').addEventListener('click', () => {
    const commentText = document.getElementById('commentText').value.trim();

    if (!commentText) {
        alert('Please write a comment before submitting.');
        return;
    }

    if (commentText.length < 10) {
        alert('Please write a more detailed comment (at least 10 characters).');
        return;
    }

    // Add comment to storage (pending approval)
    if (!commentsData[currentPlaceId]) {
        commentsData[currentPlaceId] = [];
    }

    commentsData[currentPlaceId].push({
        author: "Anonymous User", // In real app, would use logged-in user's name
        text: commentText,
        approved: false // Needs admin approval
    });

    // Reload comments
    loadComments(currentPlaceId);

    // Clear textarea
    document.getElementById('commentText').value = '';

    // Show success message
    alert('Thank you! Your comment has been submitted and will be visible after admin review.');
});

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

// Event listeners
categoryFilter.addEventListener('change', filterAndSearchPlaces);
locationFilter.addEventListener('change', filterAndSearchPlaces);
priceFilter.addEventListener('change', filterAndSearchPlaces);

resetFilters.addEventListener('click', () => {
    categoryFilter.value = 'all';
    locationFilter.value = 'all';
    priceFilter.value = 'all';
    searchInput.value = '';
    displayPlaces(placesData);
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

