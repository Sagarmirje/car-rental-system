// API Configuration
const API_URL = 'http://localhost:5000/api';

// Handle admin login
const adminLoginForm = document.getElementById('adminLoginForm');
if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        };
        
        try {
            const response = await fetch(`${API_URL}/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('admin', JSON.stringify(data.admin));
                showMessage('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'admin-dashboard.html';
                }, 1500);
            } else {
                showMessage(data.message || 'Login failed', 'error');
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
