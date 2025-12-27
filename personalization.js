// --- PERSONALIZATION.JS: Favorites, Collections, Saved List, Share Link ---

// GET CURRENT USER
const currentUser = localStorage.getItem('currentUser');
let users = JSON.parse(localStorage.getItem('users')) || {};

// LOAD FAVORITES
const loadFavorites = () => {
    if (!currentUser) return;
    let favs = users[currentUser].favorites || [];
    document.getElementById('savedList').innerHTML = '';
    favs.forEach(id => {
        let act = activities.find(a => a.id === id);
        if (act) {
            let div = document.createElement('div');
            div.className = 'discover-card';
            div.innerHTML = `<h3>${act.title}</h3><p>Category: ${act.category}</p><p>Price: $${act.price}</p>`;
            document.getElementById('savedList').appendChild(div);
        }
    });
};

// SAVE ACTIVITY TO FAVORITES
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('favorite-btn')) {
        if (!currentUser) { alert('Login to save favorites'); return; }
        const id = parseInt(e.target.dataset.id);
        let favs = users[currentUser].favorites || [];
        if (favs.includes(id)) {
            favs = favs.filter(f => f !== id); e.target.classList.remove('active');
        } else { favs.push(id); e.target.classList.add('active'); }
        users[currentUser].favorites = favs;
        localStorage.setItem('users', JSON.stringify(users));
        loadFavorites();
    }
});

// CREATE NAMED COLLECTION
document.getElementById('createCollectionBtn')?.addEventListener('click', () => {
    if (!currentUser) { alert('Login first'); return; }
    const name = prompt('Enter collection name');
    if (!name) return;
    if (users[currentUser].collections[name]) { alert('Collection exists'); return; }
    users[currentUser].collections[name] = [];
    localStorage.setItem('users', JSON.stringify(users));
    alert('Collection created');
});

// ADD TO COLLECTION
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('addToCollectionBtn')) {
        if (!currentUser) { alert('Login first'); return; }
        const colName = prompt('Enter collection name to add');
        if (!colName || !users[currentUser].collections[colName]) { alert('Collection not found'); return; }
        const actId = parseInt(e.target.dataset.id);
        users[currentUser].collections[colName].push(actId);
        localStorage.setItem('users', JSON.stringify(users));
        alert('Activity added to collection');
    }
});

// SHARE COLLECTION LINK
document.getElementById('shareCollectionBtn')?.addEventListener('click', () => {
    if (!currentUser) return;
    const colName = prompt('Enter collection name to share');
    if (!colName || !users[currentUser].collections[colName]) return;
    const shareLink = window.location.origin + window.location.pathname + '?share=' + encodeURIComponent(colName) + '&user=' + encodeURIComponent(currentUser);
    navigator.clipboard.writeText(shareLink);
    alert('Link copied to clipboard');
});

// BASIC PERSONALIZATION: SUGGESTIONS BASED ON FAVORITES
const suggestActivities = () => {
    if (!currentUser) return;
    const favs = users[currentUser].favorites || [];
    const categories = favs.map(id => activities.find(a => a.id === id)?.category).filter(c => c);
    const suggested = activities.filter(a => categories.includes(a.category) && !favs.includes(a.id));
    const container = document.getElementById('suggestedList');
    if (!container) return;
    container.innerHTML = '';
    suggested.forEach(a => {
        let div = document.createElement('div');
        div.className = 'discover-card';
        div.innerHTML = `<h3>${a.title}</h3><p>Category: ${a.category}</p><p>Price: $${a.price}</p>`;
        container.appendChild(div);
    });
};

window.addEventListener('DOMContentLoaded', () => {
    loadFavorites();
    suggestActivities();
});
