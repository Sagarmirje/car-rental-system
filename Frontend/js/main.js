// API Configuration
const API_URL = 'http://localhost:5000/api';

// Check authentication status
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const authLink = document.getElementById('authLink');
    
    if (authLink) {
        if (token && user) {
            const userData = JSON.parse(user);
            authLink.textContent = `Hi, ${userData.name}`;
            authLink.href = '#';
            authLink.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        } else {
            authLink.textContent = 'Login';
            authLink.href = 'login.html';
        }
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Load featured cars on homepage
async function loadFeaturedCars() {
    try {
        const response = await fetch(`${API_URL}/cars`);
        const cars = await response.json();
        
        const container = document.getElementById('carsContainer');
        if (container) {
            container.innerHTML = cars.slice(0, 3).map(car => createCarCard(car)).join('');
        }
    } catch (error) {
        console.error('Error loading cars:', error);
    }
}

// Create car card HTML
function createCarCard(car) {
    return `
        <div class="car-card">
            <img src="${car.image}" alt="${car.name}" class="car-image">
            <div class="car-content">
                <h3>${car.name}</h3>
                <p class="car-model">${car.model} - ${car.category}</p>
                <div class="car-details">
                    <span class="car-detail">👥 ${car.seats} Seats</span>
                    <span class="car-detail">⚙️ ${car.transmission}</span>
                    <span class="car-detail">⛽ ${car.fuel_type}</span>
                </div>
                <div class="car-features">
                    ${car.features.slice(0, 3).map(feature => 
                        `<span class="feature-badge">${feature}</span>`
                    ).join('')}
                </div>
                <div class="car-price">$${car.price_per_day}<span>/day</span></div>
                <button class="btn-primary" onclick="bookCar('${car._id}')">
                    ${car.available ? 'Book Now' : 'Not Available'}
                </button>
            </div>
        </div>
    `;
}

// Book car function
function bookCar(carId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to book a car');
        window.location.href = 'login.html';
        return;
    }
    window.location.href = `booking.html?car=${carId}`;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadFeaturedCars();
});
