// activity.js

// Example activity data
const activities = [
    { id: 1, title: "Italian Dinner", category: "Food & Drink", price: 30, hours: "10:00-22:00" },
    { id: 2, title: "Mountain Hike", category: "Outdoors", price: 0, hours: "06:00-18:00" },
    { id: 3, title: "Cooking Workshop", category: "Activities", price: 50, hours: "09:00-16:00" }
];

// Load activity from query parameter
const urlParams = new URLSearchParams(window.location.search);
const actId = parseInt(urlParams.get('id')) || 1;
const activity = activities.find(a => a.id === actId);

// Fill page with activity info
document.getElementById('activityTitle').textContent = activity.title;
document.getElementById('activityCategory').textContent = `Category: ${activity.category}`;
document.getElementById('activityPrice').textContent = `Price: $${activity.price} per person`;
document.getElementById('activityHours').textContent = `Opening Hours: ${activity.hours}`;
document.getElementById('activityDate').textContent = `Date: Daily`;

// Similar activities
const similar = activities.filter(a => a.category === activity.category && a.id !== activity.id);
const similarList = document.getElementById('similarList');
similar.forEach(a => {
    const div = document.createElement('div');
    div.className = 'discover-card';
    div.innerHTML = `<img src="https://via.placeholder.com/280x180"><div class="card-content"><h3>${a.title}</h3><p>Price: $${a.price}</p></div>`;
    div.addEventListener('click', () => { window.location.href = `activity.html?id=${a.id}` });
    similarList.appendChild(div);
});
// Get Directions Button
document.getElementById('directionsBtn')?.addEventListener('click', () => {
    if (!activity) return;

    // You can store coordinates in your activity data
    // For now, we'll search by name and location
    const searchQuery = encodeURIComponent(`${activity.title}, ${activity.location || 'Lebanon'}`);

    // Try to use device location if available
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Open Google Maps with user's current location as start point
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                window.open(`https://www.google.com/maps/dir/${lat},${lng}/${searchQuery}`, '_blank');
            },
            () => {
                // If location denied, just search for the destination
                window.open(`https://www.google.com/maps/search/${searchQuery}`, '_blank');
            }
        );
    } else {
        // Browser doesn't support geolocation
        window.open(`https://www.google.com/maps/search/${searchQuery}`, '_blank');
    }
});