# Car Rental System

A complete car rental management system with user authentication, car browsing, booking functionality, and admin dashboard.

## Technology Stack

### Frontend
- HTML5
- CSS3 (Responsive Design)
- JavaScript (Vanilla ES6+)

### Backend
- Python 3.8+
- Flask (REST API)
- Flask-CORS

### Database
- MongoDB

## Features

### User Features
- User registration and authentication
- Browse available cars with filters (category, price)
- View detailed car information
- Book cars for single or multiple days
- Real-time price calculation
- Secure booking with license and ID verification

### Admin Features
- Admin authentication
- Dashboard with statistics (users, cars, bookings, revenue)
- View all bookings
- Track license and ID card information
- Generate reports

## Project Structure

```
CC Eval-1/
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── main.js
│   │   ├── auth.js
│   │   ├── cars.js
│   │   ├── booking.js
│   │   ├── admin-auth.js
│   │   └── admin-dashboard.js
│   ├── index.html
│   ├── register.html
│   ├── login.html
│   ├── cars.html
│   ├── booking.html
│   ├── admin-login.html
│   └── admin-dashboard.html
├── backend/
│   ├── app.py
│   └── requirements.txt
└── database/
    ├── init_db.py
    └── schema.txt
```

## Installation & Setup

### Prerequisites
- Python 3.8 or higher
- MongoDB installed and running
- Modern web browser

### Step 1: Install MongoDB
1. Download MongoDB from https://www.mongodb.com/try/download/community
2. Install MongoDB Community Server
3. Start MongoDB service:
   ```
   mongod
   ```

### Step 2: Set Up Backend

1. Navigate to the backend folder:
   ```
   cd backend
   ```

2. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Initialize the database (creates sample data and admin account):
   ```
   cd ../database
   python init_db.py
   ```

4. Start the Flask backend server:
   ```
   cd ../backend
   python app.py
   ```

   The backend will run on http://localhost:5000

### Step 3: Access the Frontend

1. Open the frontend folder and launch index.html in your browser:
   ```
   start frontend/index.html
   ```
   
   Or simply open `frontend/index.html` in your web browser

## Default Admin Credentials

- **Username:** admin
- **Password:** admin123

## Using the System

### For Users:

1. **Register an Account:**
   - Click "Register" in the navigation
   - Fill in your details
   - Submit the form

2. **Login:**
   - Click "Login"
   - Enter your email and password

3. **Browse Cars:**
   - Navigate to "Cars" page
   - Use filters to find cars by category or price
   - Click "Book Now" on your desired car

4. **Make a Booking:**
   - Select start and end dates
   - Enter your driver's license number
   - Enter your ID card number
   - Confirm the booking

### For Admins:

1. **Admin Login:**
   - Click "Admin" in the navigation
   - Enter admin credentials
   - Access the dashboard

2. **View Dashboard:**
   - See statistics (users, cars, bookings, revenue)
   - View recent bookings
   - Access detailed booking information

## API Endpoints

### User Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login

### Cars
- `GET /api/cars` - Get all cars
- `GET /api/cars/<car_id>` - Get single car

### Bookings
- `POST /api/bookings` - Create booking (requires authentication)
- `GET /api/bookings/user` - Get user's bookings (requires authentication)

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/bookings` - Get all bookings (requires admin auth)
- `GET /api/admin/statistics` - Get dashboard statistics (requires admin auth)

## Database Schema

### Collections:

1. **users** - User accounts
2. **cars** - Car inventory
3. **bookings** - Rental bookings
4. **admins** - Admin accounts

See `database/schema.txt` for detailed schema information.

## Features Highlights

- ✅ Responsive design for all devices
- ✅ Real-time car availability
- ✅ Secure password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Dynamic price calculation
- ✅ Filter and search functionality
- ✅ Admin dashboard with statistics
- ✅ Real car images from Unsplash
- ✅ Professional UI/UX design

## Security Features

- Password encryption using bcrypt
- JWT token-based authentication
- Authorization middleware for protected routes
- Input validation
- Secure session management

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Troubleshooting

### MongoDB Connection Issues:
- Ensure MongoDB is running: `mongod`
- Check if MongoDB is listening on port 27017
- Verify MongoDB installation

### Backend Not Starting:
- Check if all dependencies are installed
- Ensure Python 3.8+ is installed
- Verify no other service is using port 5000

### CORS Issues:
- Backend includes CORS headers
- Ensure backend is running on port 5000
- Check browser console for specific errors

## Development Notes

- Backend runs on http://localhost:5000
- Frontend can be served from any web server or opened directly
- All images are loaded from Unsplash CDN
- Sample data includes 8 different car models

## Future Enhancements

- Payment integration
- Email notifications
- Car return management
- User booking history
- Reviews and ratings
- Advanced search filters
- Mobile app version

## License

This project is created for educational purposes.

## Support

For issues or questions, please check:
1. MongoDB is running
2. All dependencies are installed
3. Backend server is running
4. Browser console for errors

---

**Enjoy your car rental system!** 🚗
