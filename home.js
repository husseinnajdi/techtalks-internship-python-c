// --- HOME.JS: Complete JavaScript for Kazdoura Website ---

// DOM Elements
const filterPanel = document.getElementById('filterPanel');
const overlay = document.getElementById('overlay');
const filterBtn = document.getElementById('filterBtn');
const closeFilter = document.getElementById('closeFilter');
const resetFilter = document.getElementById('resetFilter');
const applyFilter = document.getElementById('applyFilter');
const searchInput = document.getElementById('search');
const suggestionsPanel = document.getElementById('suggestionsPanel');
const suggestionsList = suggestionsPanel.querySelector('ul');
const priceMinInput = document.getElementById('priceMin');
const priceMaxInput = document.getElementById('priceMax');

// Time selectors
const hourSelect = document.getElementById('hour');
const minuteSelect = document.getElementById('minute');
const ampmSelect = document.getElementById('ampm');

// Prevent negative prices
priceMinInput.addEventListener('input', (e) => {
    if (e.target.value < 0) e.target.value = 0;
});
priceMaxInput.addEventListener('input', (e) => {
    if (e.target.value < 0) e.target.value = 0;
});
//2nd option
const searchForm = document.getElementById('filterForm');
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = document.getElementById('search').value;
        // Redirects to places page with the search term in the URL
        window.location.href = `places.html?search=${encodeURIComponent(query)}`;
    });
}
// --- PAGE LOAD ANIMATIONS ---
document.addEventListener('DOMContentLoaded', () => {
    // Hero animation
    const heroContent = document.querySelector('.hero-content');
    const h1 = document.querySelector('.hero h1');
    const h2 = document.querySelector('.hero h2');

    setTimeout(() => {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(20px)';
        heroContent.style.transition = 'all 0.8s ease-out';

        requestAnimationFrame(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        });
    }, 300);

    setTimeout(() => {
        h1.style.opacity = '0';
        h1.style.transform = 'translateY(10px)';
        h1.style.transition = 'all 0.6s ease-out';

        requestAnimationFrame(() => {
            h1.style.opacity = '1';
            h1.style.transform = 'translateY(0)';
        });
    }, 500);

    setTimeout(() => {
        h2.style.opacity = '0';
        h2.style.transform = 'translateY(10px)';
        h2.style.transition = 'all 0.6s ease-out 0.2s';

        requestAnimationFrame(() => {
            h2.style.opacity = '1';
            h2.style.transform = 'translateY(0)';
        });
    }, 700);

    // Card hover effects
    document.querySelectorAll('.card, .category-item').forEach(item => {
        item.addEventListener('mouseenter', function () {
            this.style.zIndex = '10';
        });

        item.addEventListener('mouseleave', function () {
            this.style.zIndex = '1';
        });
    });
});

// --- FILTER PANEL LOGIC ---
filterBtn.addEventListener('click', () => {
    filterPanel.classList.add('active');
    overlay.style.display = 'block';
});

closeFilter.addEventListener('click', () => {
    filterPanel.classList.remove('active');
    overlay.style.display = 'none';
});

overlay.addEventListener('click', () => {
    filterPanel.classList.remove('active');
    overlay.style.display = 'none';
});

// --- FILTER PILLS (Toggle Selection) ---
document.querySelectorAll('.filter-pills').forEach(container => {
    container.addEventListener('click', (e) => {
        const clickedPill = e.target.closest('.pill');
        if (clickedPill) {
            clickedPill.classList.toggle('active');
        }
    });
});

// --- SEARCH AUTOSUGGEST LOGIC ---
let timeout = null;
let activeSuggestionIndex = -1;

const updateSuggestionActiveState = (newIndex) => {
    const suggestions = suggestionsList.querySelectorAll('li a');

    if (activeSuggestionIndex !== -1 && suggestions[activeSuggestionIndex]) {
        suggestions[activeSuggestionIndex].classList.remove('active');
    }

    if (newIndex >= 0 && newIndex < suggestions.length) {
        activeSuggestionIndex = newIndex;
        suggestions[activeSuggestionIndex].classList.add('active');
        suggestions[activeSuggestionIndex].scrollIntoView({ block: 'nearest' });
    }
};

const debounce = (func, delay) => {
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), delay);
    };
};

const handleSearchInput = () => {
    const query = searchInput.value.trim();

    if (query.length > 2) {
        suggestionsPanel.classList.add('active');
        activeSuggestionIndex = -1;
    } else {
        suggestionsPanel.classList.remove('active');
        activeSuggestionIndex = -1;
    }
};

searchInput.addEventListener('input', debounce(handleSearchInput, 300));

searchInput.addEventListener('keydown', (e) => {
    const suggestions = suggestionsList.querySelectorAll('li a');

    if (!suggestionsPanel.classList.contains('active') || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        let newIndex = activeSuggestionIndex + 1;
        if (newIndex >= suggestions.length) newIndex = 0;
        updateSuggestionActiveState(newIndex);
    }
    else if (e.key === 'ArrowUp') {
        e.preventDefault();
        let newIndex = activeSuggestionIndex - 1;
        if (newIndex < 0) newIndex = suggestions.length - 1;
        updateSuggestionActiveState(newIndex);
    }
    else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeSuggestionIndex !== -1) {
            searchInput.value = suggestions[activeSuggestionIndex].textContent;
            suggestionsPanel.classList.remove('active');
            activeSuggestionIndex = -1;
            document.getElementById("filterForm").dispatchEvent(new Event('submit'));
        } else {
            document.getElementById("filterForm").dispatchEvent(new Event('submit'));
        }
    }
});

document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) &&
        !suggestionsPanel.contains(e.target) &&
        !filterBtn.contains(e.target)) {
        suggestionsPanel.classList.remove('active');
    }
});

// --- FILTER RESET FUNCTION ---
resetFilter.addEventListener('click', () => {
    // Reset all pills (remove active class)
    document.querySelectorAll('.pill').forEach(pill => {
        pill.classList.remove('active');
    });

    // Reset time selectors
    hourSelect.selectedIndex = 0;
    minuteSelect.selectedIndex = 0;
    ampmSelect.selectedIndex = 0;

    // Reset other inputs
    document.getElementById('location').selectedIndex = 0;
    priceMinInput.value = '';
    priceMaxInput.value = '';

    // Reset search
    searchInput.value = '';
    suggestionsPanel.classList.remove('active');
});

// --- FILTER APPLY FUNCTION ---
applyFilter.addEventListener('click', () => {
    // Collect all filter data
    const filters = {
        // Get active categories
        categories: Array.from(document.querySelectorAll('.category-pills .pill.active'))
            .map(pill => pill.dataset.category),

        // Get time (convert to 24-hour format if needed)
        time: getFormattedTime(),

        // Get price range
        priceMin: priceMinInput.value,
        priceMax: priceMaxInput.value,

        // Get location
        location: document.getElementById('location').value,

        // Get search query
        search: searchInput.value
    };

    console.log('Applied filters:', filters);

    // Here you would typically:
    // 1. Send filters to backend API
    // 2. Filter places on frontend
    // 3. Redirect to places page with filter parameters

    // For now, just close the filter
    filterPanel.classList.remove('active');
    overlay.style.display = 'none';

    // Show a message (optional)
    showFilterAppliedMessage(filters);
});

// Helper function to format time
function getFormattedTime() {
    const hour = hourSelect.value;
    const minute = minuteSelect.value;
    const ampm = ampmSelect.value;

    if (!hour || !minute || !ampm) {
        return null;
    }

    // Convert to 24-hour format for backend processing
    let hour24 = parseInt(hour);

    if (ampm === 'PM' && hour24 !== 12) {
        hour24 += 12;
    } else if (ampm === 'AM' && hour24 === 12) {
        hour24 = 0;
    }

    // Return formatted time (HH:MM)
    return `${hour24.toString().padStart(2, '0')}:${minute}`;
}

// Helper function to show filter applied message
function showFilterAppliedMessage(filters) {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, var(--accent-gold), var(--brown-light));
        color: white;
        padding: 15px 25px;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: fadeInDown 0.3s ease;
        font-weight: 600;
    `;

    // Count active filters
    const activeFilterCount = [
        filters.categories.length > 0,
        filters.time !== null,
        filters.priceMin || filters.priceMax,
        filters.location,
        filters.search
    ].filter(Boolean).length;

    notification.textContent = `✅ ${activeFilterCount} filter${activeFilterCount !== 1 ? 's' : ''} applied`;
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-10px)';
        notification.style.transition = 'all 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// --- FORM SUBMISSION HANDLER ---
document.getElementById("filterForm").addEventListener("submit", (e) => {
    e.preventDefault();
    applyFilter.click();
});

// --- TIME SELECTOR VALIDATION ---
// Ensure time is selected completely or not at all
hourSelect.addEventListener('change', validateTimeSelection);
minuteSelect.addEventListener('change', validateTimeSelection);
ampmSelect.addEventListener('change', validateTimeSelection);

function validateTimeSelection() {
    const hour = hourSelect.value;
    const minute = minuteSelect.value;
    const ampm = ampmSelect.value;

    // If any time field is selected, all should be selected
    if ((hour || minute || ampm) && (!hour || !minute || !ampm)) {
        // Show warning
        const timeInputs = document.querySelector('.time-inputs');
        let warning = timeInputs.querySelector('.time-warning');

        if (!warning) {
            warning = document.createElement('div');
            warning.className = 'time-warning';
            warning.style.cssText = `
                color: var(--brown-medium);
                font-size: 13px;
                margin-top: 5px;
                font-style: italic;
            `;
            timeInputs.appendChild(warning);
        }

        warning.textContent = "Please select hour, minute, and AM/PM for complete time selection";
    } else {
        // Remove warning if exists
        const warning = document.querySelector('.time-warning');
        if (warning) {
            warning.remove();
        }
    }
}

// --- ENHANCED CARD INTERACTIONS ---
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', function () {
        // Add a "selected" effect
        this.classList.toggle('selected');

        // Remove from other cards
        document.querySelectorAll('.card').forEach(otherCard => {
            if (otherCard !== this) {
                otherCard.classList.remove('selected');
            }
        });
    });
});
// --- DISTANCE FILTER FUNCTIONALITY ---

// Show/hide distance filter based on location permission
function updateDistanceFilterVisibility() {
    const locationPermission = localStorage.getItem('locationPermission');
    const distanceGroup = document.getElementById('distanceFilterGroup');
    
    if (locationPermission === 'granted' && distanceGroup) {
        distanceGroup.style.display = 'block';
    }
}

// Update distance slider display
const distanceSlider = document.getElementById('distanceSlider');
const distanceValue = document.getElementById('distanceValue');

if (distanceSlider && distanceValue) {
    distanceSlider.addEventListener('input', function() {
        distanceValue.textContent = this.value;
        
        // Update slider background color dynamically
        const percentage = (this.value - this.min) / (this.max - this.min) * 100;
        this.style.background = `linear-gradient(to right, var(--accent-gold) 0%, var(--accent-gold) ${percentage}%, var(--cream-dark) ${percentage}%, var(--cream-dark) 100%)`;
    });
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
}

// Call this when page loads
updateDistanceFilterVisibility();
// --- LOCATION PERMISSION PROMPT ---
document.addEventListener('DOMContentLoaded', () => {
    // Check if user has already responded to location prompt
    const locationPermission = localStorage.getItem('locationPermission');

    if (!locationPermission) {
        // Show modal after 2 seconds
        setTimeout(() => {
            const modal = document.getElementById('locationModal');
            if (modal) {
                modal.style.display = 'flex';
            }
        }, 2000);
    }

    // Allow Location Button
    const allowBtn = document.getElementById('allowLocation');
    if (allowBtn) {
        allowBtn.addEventListener('click', function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        // Success - save location
                        const userLocation = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            timestamp: new Date().toISOString()
                        };
                        localStorage.setItem('userLocation', JSON.stringify(userLocation));
                        localStorage.setItem('locationPermission', 'granted');

                        // Hide modal
                        const modal = document.getElementById('locationModal');
                        if (modal) {
                            modal.style.display = 'none';
                        }

                        // Show success notification
                        showNotification('✅ Location enabled! You can now see distances and nearby places.');
                    },
                    function (error) {
                        // Error - user denied or error occurred
                        console.error('Location error:', error);
                        localStorage.setItem('locationPermission', 'denied');
                        const modal = document.getElementById('locationModal');
                        if (modal) {
                            modal.style.display = 'none';
                        }
                        showNotification('Location access was denied. You can enable it later in your browser settings.');
                    }
                );
            } else {
                const modal = document.getElementById('locationModal');
                if (modal) {
                    modal.style.display = 'none';
                }
                showNotification('Your browser does not support location services.');
            }
        });
    }

    // Deny Location Button
    const denyBtn = document.getElementById('denyLocation');
    if (denyBtn) {
        denyBtn.addEventListener('click', function () {
            localStorage.setItem('locationPermission', 'denied');
            const modal = document.getElementById('locationModal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    }
});

// Helper function to show notifications
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
    }, 3000);
}
// --- AUTHENTICATION UI LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const currentUserJSON = localStorage.getItem('currentUser');
    if (currentUserJSON) {
        try {
            const user = JSON.parse(currentUserJSON);
            const loginBtn = document.querySelector('.login-btn');
            
            if (loginBtn) {
                // Display the user's name
                const displayName = user.displayName || (user.email ? user.email.split('@')[0] : 'User');
                
                // Update button style and text
                loginBtn.innerHTML = '<span> ' + displayName + '</span>';
                loginBtn.href = '#';
                loginBtn.title = 'Click to Logout';
                
                // Add logout handler
                loginBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (confirm('Are you sure you want to log out?')) {
                        localStorage.removeItem('currentUser');
                        window.location.reload();
                    }
                });
            }
        } catch (e) {
            console.error('Error parsing user data:', e);
        }
    }
});
