// API Configuration
const API_URL = 'http://localhost:5000/api';

let currentCar = null;
let pricePerDay = 0;

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to book a car');
        window.location.href = 'login.html';
        return;
    }
    
    const user = localStorage.getItem('user');
    const authLink = document.getElementById('authLink');
    
    if (authLink && user) {
        const userData = JSON.parse(user);
        authLink.textContent = `Hi, ${userData.name}`;
        authLink.href = '#';
        authLink.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Get car ID from URL
function getCarIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('car');
}

// Load car details
async function loadCarDetails() {
    const carId = getCarIdFromURL();
    if (!carId) {
        alert('No car selected');
        window.location.href = 'cars.html';
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/cars/${carId}`);
        currentCar = await response.json();
        pricePerDay = currentCar.price_per_day;
        displayCarDetails(currentCar);
    } catch (error) {
        console.error('Error loading car details:', error);
        alert('Error loading car details');
    }
}

// Display car details
function displayCarDetails(car) {
    const container = document.getElementById('carDetails');
    container.innerHTML = `
        <img src="${car.image}" alt="${car.name}" class="car-image" style="width: 100%; border-radius: 10px; margin-bottom: 1rem;">
        <h3>${car.name}</h3>
        <p class="car-model">${car.model} - ${car.category}</p>
        <p>${car.description}</p>
        <div class="car-details" style="margin: 1rem 0;">
            <span class="car-detail">👥 ${car.seats} Seats</span>
            <span class="car-detail">⚙️ ${car.transmission}</span>
            <span class="car-detail">⛽ ${car.fuel_type}</span>
        </div>
        <div class="car-features">
            ${car.features.map(feature => 
                `<span class="feature-badge">${feature}</span>`
            ).join('')}
        </div>
        <div class="car-price" style="margin-top: 1rem;">$${car.price_per_day}<span>/day</span></div>
    `;
}

// Calculate price
function calculatePrice() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        
        if (days > 0) {
            const totalPrice = days * pricePerDay;
            displayPriceCalculation(days, totalPrice);
        } else {
            document.getElementById('priceCalculation').innerHTML = '';
        }
    }
}

// Display price calculation
function displayPriceCalculation(days, totalPrice) {
    const container = document.getElementById('priceCalculation');
    container.innerHTML = `
        <p><strong>Price per day:</strong> <span>$${pricePerDay}</span></p>
        <p><strong>Number of days:</strong> <span>${days}</span></p>
        <p class="total"><strong>Total Price:</strong> <span>$${totalPrice}</span></p>
    `;
}

// Set minimum date to today
function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('startDate').setAttribute('min', today);
    document.getElementById('endDate').setAttribute('min', today);
}

// Handle booking form submission
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const licenseCard = document.getElementById('licenseCard').value;
        const idCard = document.getElementById('idCard').value;
        
        // Validation
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (end < start) {
            showMessage('End date must be after start date', 'error');
            return;
        }
        
        const bookingData = {
            car_id: getCarIdFromURL(),
            start_date: startDate,
            end_date: endDate,
            license_card: licenseCard,
            id_card: idCard
        };
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(bookingData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showMessage('Booking successful! Total: $' + data.total_price, 'success');
                setTimeout(() => {
                    window.location.href = 'cars.html';
                }, 2000);
            } else {
                showMessage(data.message || 'Booking failed', 'error');
            }
        } catch (error) {
            showMessage('Error: ' + error.message, 'error');
        }
    });
}

// Show message function
function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadCarDetails();
    setMinDate();
    
    // Add event listeners for date changes
    document.getElementById('startDate').addEventListener('change', calculatePrice);
    document.getElementById('endDate').addEventListener('change', calculatePrice);
});
