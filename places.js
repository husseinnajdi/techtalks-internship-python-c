// Places data
// Places data
let placesData = [];

// Fetch places from Backend
async function fetchPlaces() {
    try {
        const response = await fetch(`${API_URL}/activitys`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const backendPlaces = await response.json();

        // Map backend data to frontend structure
        placesData = backendPlaces.map(place => {
            // Determine price category based on AvgBudget
            let priceCode = "budget";
            let priceDisplay = "$";
            if (place.AvgBudget === 0) {
                priceCode = "free";
                priceDisplay = "Free";
            } else if (place.AvgBudget > 50) {
                priceCode = "expensive";
                priceDisplay = "$$$";
            } else if (place.AvgBudget > 20) {
                priceCode = "moderate";
                priceDisplay = "$$";
            }

            // Image URL logic (placeholder if missing, or construct if ID exists)
            // Note: Currently backend provides {id: "string", IsMainImage: bool} but no direct URL endpoint confirmed.
            // Using placeholder for now unless ID looks like a URL.
            let imageUrl = "https://via.placeholder.com/400x300/CCCCCC/666666?text=No+Image";
            if (place.main_image && place.main_image.id) {
                // Assuming ID might be a URL in some cases, or we'd need an endpoint like /images/{id}
                // For now, if it starts with http, use it, else placeholder.
                if (place.main_image.id.startsWith("http")) {
                    imageUrl = place.main_image.id;
                }
            }

            return {
                id: place.id,
                name: place.name || place.Description.substring(0, 20) || `Activity #${place.id}`, // Fallback since Name is missing in backend model
                category: place.Type,
                location: place.Location,
                price: priceCode,
                priceDisplay: priceDisplay,
                image: imageUrl,
                description: place.Description,
                hours: "9:00 AM - 6:00 PM", // Default/Missing
                contact: place.PhoneNumber
            };
        });

        // Update display
        displayPlaces(placesData);

    } catch (error) {
        console.error("Failed to fetch places:", error);
        placesGrid.innerHTML = '<p style="text-align: center; color: red;">Failed to load places. Please try again later.</p>';
    }
}

// Initial fetch
document.addEventListener('DOMContentLoaded', fetchPlaces);

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

// Display all places initially - MOVED to fetchPlaces()
// displayPlaces(placesData);

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

