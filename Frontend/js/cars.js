// API Configuration
const API_URL = 'http://localhost:5000/api';

let allCars = [];
let filteredCars = [];

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

// Load all cars
async function loadCars() {
    try {
        const response = await fetch(`${API_URL}/cars`);
        allCars = await response.json();
        filteredCars = [...allCars];
        displayCars(filteredCars);
    } catch (error) {
        console.error('Error loading cars:', error);
    }
}

// Display cars
function displayCars(cars) {
    const container = document.getElementById('carsContainer');
    
    if (cars.length === 0) {
        container.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No cars found matching your criteria.</p>';
        return;
    }
    
    container.innerHTML = cars.map(car => createCarCard(car)).join('');
}

// Create car card HTML
function createCarCard(car) {
    return `
        <div class="car-card">
            <img src="${car.image}" alt="${car.name}" class="car-image">
            <div class="car-content">
                <h3>${car.name}</h3>
                <p class="car-model">${car.model} - ${car.category}</p>
                <p class="car-description">${car.description}</p>
                <div class="car-details">
                    <span class="car-detail">👥 ${car.seats} Seats</span>
                    <span class="car-detail">⚙️ ${car.transmission}</span>
                    <span class="car-detail">⛽ ${car.fuel_type}</span>
                </div>
                <div class="car-features">
                    ${car.features.map(feature => 
                        `<span class="feature-badge">${feature}</span>`
                    ).join('')}
                </div>
                <div class="car-price">$${car.price_per_day}<span>/day</span></div>
                <button class="btn-primary" onclick="bookCar('${car._id}')" ${!car.available ? 'disabled' : ''}>
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

// Filter by category
function filterByCategory(category) {
    if (category === 'all') {
        filteredCars = [...allCars];
    } else {
        filteredCars = allCars.filter(car => car.category === category);
    }
    applyPriceFilter();
}

// Filter by price
function filterByPrice(priceRange) {
    let categoryFiltered = [...allCars];
    const categoryFilter = document.getElementById('categoryFilter').value;
    
    if (categoryFilter !== 'all') {
        categoryFiltered = allCars.filter(car => car.category === categoryFilter);
    }
    
    if (priceRange === 'all') {
        filteredCars = categoryFiltered;
    } else if (priceRange === 'low') {
        filteredCars = categoryFiltered.filter(car => car.price_per_day < 150);
    } else if (priceRange === 'medium') {
        filteredCars = categoryFiltered.filter(car => car.price_per_day >= 150 && car.price_per_day <= 250);
    } else if (priceRange === 'high') {
        filteredCars = categoryFiltered.filter(car => car.price_per_day > 250);
    }
    
    displayCars(filteredCars);
}

// Apply price filter
function applyPriceFilter() {
    const priceFilter = document.getElementById('priceFilter').value;
    filterByPrice(priceFilter);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadCars();
    
    // Add event listeners to filters
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            filterByCategory(e.target.value);
        });
    }
    
    if (priceFilter) {
        priceFilter.addEventListener('change', (e) => {
            filterByPrice(e.target.value);
        });
    }
});
