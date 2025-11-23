// API Configuration
const API_URL = 'http://localhost:5000/api';

// Check admin authentication
function checkAdminAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        alert('Please login as admin');
        window.location.href = 'admin-login.html';
        return false;
    }
    return true;
}

// Logout function
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        window.location.href = 'admin-login.html';
    });
}

// Load statistics
async function loadStatistics() {
    try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_URL}/admin/statistics`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            displayStatistics(data);
            displayRecentBookings(data.recent_bookings);
        } else {
            if (response.status === 401) {
                alert('Session expired. Please login again.');
                window.location.href = 'admin-login.html';
            }
        }
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// Display statistics
function displayStatistics(stats) {
    const statsGrid = document.getElementById('statsGrid');
    statsGrid.innerHTML = `
        <div class="stat-card">
            <h3>Total Users</h3>
            <div class="stat-value">${stats.total_users}</div>
        </div>
        <div class="stat-card">
            <h3>Total Cars</h3>
            <div class="stat-value">${stats.total_cars}</div>
        </div>
        <div class="stat-card">
            <h3>Total Bookings</h3>
            <div class="stat-value">${stats.total_bookings}</div>
        </div>
        <div class="stat-card">
            <h3>Available Cars</h3>
            <div class="stat-value">${stats.available_cars}</div>
        </div>
        <div class="stat-card">
            <h3>Total Revenue</h3>
            <div class="stat-value">$${stats.total_revenue.toFixed(2)}</div>
        </div>
    `;
}

// Display recent bookings
function displayRecentBookings(bookings) {
    const container = document.getElementById('recentBookings');
    
    if (bookings.length === 0) {
        container.innerHTML = '<p>No recent bookings</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="table-responsive">
            <table class="bookings-table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Car</th>
                        <th>Start Date</th>
                        <th>Total Price</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${bookings.map(booking => `
                        <tr>
                            <td>${booking.user_name}</td>
                            <td>${booking.car_name}</td>
                            <td>${new Date(booking.start_date).toLocaleDateString()}</td>
                            <td>$${booking.total_price}</td>
                            <td><span class="status-badge status-${booking.status}">${booking.status}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Load all bookings
async function loadAllBookings() {
    try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_URL}/admin/bookings`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const bookings = await response.json();
        
        if (response.ok) {
            displayAllBookings(bookings);
        }
    } catch (error) {
        console.error('Error loading bookings:', error);
    }
}

// Display all bookings
function displayAllBookings(bookings) {
    const tbody = document.getElementById('bookingsTable');
    
    if (bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align: center;">No bookings found</td></tr>';
        return;
    }
    
    tbody.innerHTML = bookings.map(booking => `
        <tr>
            <td>${booking._id.substring(0, 8)}...</td>
            <td>
                <div>${booking.user_name}</div>
                <div style="font-size: 0.85rem; color: #6b7280;">${booking.user_email}</div>
            </td>
            <td>
                <div>${booking.car_name}</div>
                <div style="font-size: 0.85rem; color: #6b7280;">${booking.car_model}</div>
            </td>
            <td>${new Date(booking.start_date).toLocaleDateString()}</td>
            <td>${new Date(booking.end_date).toLocaleDateString()}</td>
            <td>${booking.days}</td>
            <td style="font-weight: bold; color: var(--primary-color);">$${booking.total_price}</td>
            <td>${booking.license_card}</td>
            <td>${booking.id_card}</td>
            <td><span class="status-badge status-${booking.status}">${booking.status}</span></td>
        </tr>
    `).join('');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (checkAdminAuth()) {
        loadStatistics();
        loadAllBookings();
    }
});
