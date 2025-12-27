// --- DISCOVER.JS: Load Activities, Infinite Scroll, Category & Budget Filter ---

// --- DISCOVER.JS: Load Activities, Infinite Scroll, Category & Budget Filter ---

const discoverList = document.getElementById('discoverList');
const loadMoreBtn = document.getElementById('loadMoreBtn');

let activities = [
    { id: 1, title: 'Visit Byblos Castle', category: 'culture', price: 50, time: 'today', location: 'Byblos', coordinates: { lat: 34.1208, lng: 35.6481 } },
    { id: 2, title: 'Jeita Grotto Tour', category: 'outdoors', price: 30, time: 'weekend', location: 'Beirut', coordinates: { lat: 33.9478, lng: 35.6383 } },
    { id: 3, title: 'Zaitunay Bay Dinner', category: 'food', price: 80, time: 'today', location: 'Beirut', coordinates: { lat: 33.9021, lng: 35.5040 } },
    { id: 4, title: 'Cedars Hiking', category: 'outdoors', price: 20, time: 'weekend', location: 'Bsharri', coordinates: { lat: 34.2778, lng: 36.0111 } },
    { id: 5, title: 'Tyre Beach Day', category: 'outdoors', price: 40, time: 'today', location: 'Tyre', coordinates: { lat: 33.2704, lng: 35.2038 } },
    { id: 6, title: 'Lebanese Cooking Class', category: 'food', price: 60, time: 'weekend', location: 'Beirut', coordinates: { lat: 33.8886, lng: 35.4955 } }
];

let itemsPerPage = 3, currentPage = 0;
let isLoading = false;

const renderActivities = (items) => {
    items.forEach(act => {
        const div = document.createElement('div');
        div.classList.add('discover-card');
        div.innerHTML = `
            <h3>${act.title}</h3>
            <p>Category: ${act.category}</p>
            <p>Price: $${act.price}</p>
            <button class="favorite-btn" data-id="${act.id}">❤</button>
        `;
        discoverList.appendChild(div);
    });
    attachFavoriteEvents();
};

const loadNextPage = () => {
    if (isLoading) return;
    isLoading = true;

    const filteredActivities = activities.filter(act => {
        const cat = document.querySelector('.category-pills .pill.active')?.dataset.category;
        const time = document.querySelector('.duration-pills .pill.active')?.dataset.time || '';
        let priceMin = parseFloat(document.getElementById('priceMin')?.value) || 0;
        let priceMax = parseFloat(document.getElementById('priceMax')?.value) || Infinity;
        let priceOk = act.price >= priceMin && act.price <= priceMax;
        let catOk = !cat || cat === 'all' || act.category === cat;
        let timeOk = !time || act.time === time;
        
        // NEW: Distance filter
        let distanceOk = true;
        const userLocation = JSON.parse(localStorage.getItem('userLocation') || 'null');
        const maxDistance = document.getElementById('distanceSlider')?.value;
        
        if (userLocation && maxDistance && act.coordinates) {
            const distance = calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                act.coordinates.lat,
                act.coordinates.lng
            );
            distanceOk = distance <= parseFloat(maxDistance);
        }
        
        return priceOk && catOk && timeOk && distanceOk;
    });

    const start = currentPage * itemsPerPage;
    const nextItems = filteredActivities.slice(start, start + itemsPerPage);
    
    setTimeout(() => {
        renderActivities(nextItems);
        currentPage++;
        isLoading = false;

        if (currentPage * itemsPerPage >= filteredActivities.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }, 500);
};

// Button click still works
loadMoreBtn?.addEventListener('click', () => { loadNextPage(); });

// NEW: Infinite Scroll - Load when user scrolls near bottom
window.addEventListener('scroll', () => {
    if (isLoading) return;

    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    // When user is 300px from bottom, load more
    if (scrollTop + clientHeight >= scrollHeight - 300) {
        loadNextPage();
    }
});

document.getElementById('applyFilter')?.addEventListener('click', () => {
    discoverList.innerHTML = '';
    currentPage = 0;
    loadNextPage();
});

window.addEventListener('DOMContentLoaded', () => { loadNextPage(); });

// --- FAVORITE BUTTONS ---
const attachFavoriteEvents = () => {
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            const id = parseInt(btn.dataset.id);
            if (favorites.includes(id)) {
                favorites = favorites.filter(f => f !== id);
                btn.classList.remove('active');
            } else {
                favorites.push(id);
                btn.classList.add('active');
            }
            localStorage.setItem('favorites', JSON.stringify(favorites));
        });
    });

};
