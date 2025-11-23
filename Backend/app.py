# Main Flask application for Car Rental System
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from datetime import datetime, timedelta
import bcrypt
import jwt
import json
import os
from functools import wraps
import uuid

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = 'your-secret-key-change-in-production'

# Simple file-based storage (for demo without MongoDB)
DATA_DIR = 'data'
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

def load_data(filename):
    filepath = os.path.join(DATA_DIR, filename)
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            return json.load(f)
    return []

def save_data(filename, data):
    filepath = os.path.join(DATA_DIR, filename)
    with open(filepath, 'w') as f:
        json.dump(data, f, default=str)

# Initialize sample data
def init_data():
    # Sample cars
    cars = load_data('cars.json')
    if not cars:
        cars = [
            {'_id': str(uuid.uuid4()), 'name': 'Tesla Model 3', 'model': '2024', 'category': 'Electric', 'price_per_day': 150, 'seats': 5, 'transmission': 'Automatic', 'fuel_type': 'Electric', 'image': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800', 'features': ['GPS', 'Bluetooth', 'Backup Camera', 'Autopilot'], 'available': True, 'description': 'Experience the future of driving with the Tesla Model 3.'},
            {'_id': str(uuid.uuid4()), 'name': 'BMW X5', 'model': '2023', 'category': 'SUV', 'price_per_day': 200, 'seats': 7, 'transmission': 'Automatic', 'fuel_type': 'Gasoline', 'image': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800', 'features': ['GPS', 'Leather Seats', 'Sunroof', 'All-Wheel Drive'], 'available': True, 'description': 'Luxury SUV perfect for family trips and adventures.'},
            {'_id': str(uuid.uuid4()), 'name': 'Mercedes-Benz C-Class', 'model': '2024', 'category': 'Sedan', 'price_per_day': 180, 'seats': 5, 'transmission': 'Automatic', 'fuel_type': 'Gasoline', 'image': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800', 'features': ['GPS', 'Premium Sound', 'Heated Seats', 'Parking Assist'], 'available': True, 'description': 'Elegant and powerful sedan for business and leisure.'},
            {'_id': str(uuid.uuid4()), 'name': 'Audi A4', 'model': '2023', 'category': 'Sedan', 'price_per_day': 160, 'seats': 5, 'transmission': 'Automatic', 'fuel_type': 'Gasoline', 'image': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800', 'features': ['GPS', 'Bluetooth', 'Cruise Control', 'LED Lights'], 'available': True, 'description': 'Sophisticated German engineering meets modern design.'},
            {'_id': str(uuid.uuid4()), 'name': 'Toyota Camry', 'model': '2023', 'category': 'Sedan', 'price_per_day': 100, 'seats': 5, 'transmission': 'Automatic', 'fuel_type': 'Hybrid', 'image': 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800', 'features': ['GPS', 'Bluetooth', 'Backup Camera', 'Fuel Efficient'], 'available': True, 'description': 'Reliable and fuel-efficient sedan for everyday use.'},
            {'_id': str(uuid.uuid4()), 'name': 'Honda CR-V', 'model': '2024', 'category': 'SUV', 'price_per_day': 130, 'seats': 5, 'transmission': 'Automatic', 'fuel_type': 'Gasoline', 'image': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800', 'features': ['GPS', 'Apple CarPlay', 'Spacious Cargo', 'Safety Features'], 'available': True, 'description': 'Versatile SUV perfect for families and road trips.'},
            {'_id': str(uuid.uuid4()), 'name': 'Porsche 911', 'model': '2024', 'category': 'Sports', 'price_per_day': 400, 'seats': 2, 'transmission': 'Automatic', 'fuel_type': 'Gasoline', 'image': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800', 'features': ['High Performance', 'Sport Mode', 'Premium Audio', 'Racing Seats'], 'available': True, 'description': 'Iconic sports car delivering unmatched performance.'},
        ]
        save_data('cars.json', cars)
    
    # Create admin
    admins = load_data('admins.json')
    if not admins:
        admin_password = bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt())
        admins = [{'_id': str(uuid.uuid4()), 'username': 'admin', 'password': admin_password.decode('utf-8'), 'created_at': datetime.utcnow().isoformat()}]
        save_data('admins.json', admins)

init_data()

# Token verification decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        try:
            token = token.split(' ')[1] if ' ' in token else token
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            users = load_data('users.json')
            current_user = next((u for u in users if u['_id'] == data['user_id']), None)
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# Admin token verification decorator
def admin_token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        try:
            token = token.split(' ')[1] if ' ' in token else token
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            admins = load_data('admins.json')
            current_admin = next((a for a in admins if a['_id'] == data['admin_id']), None)
            if not current_admin:
                return jsonify({'message': 'Unauthorized'}), 401
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        return f(current_admin, *args, **kwargs)
    return decorated

# User Registration
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    users = load_data('users.json')
    
    if any(u['email'] == data['email'] for u in users):
        return jsonify({'message': 'Email already exists'}), 400
    
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    
    user = {
        '_id': str(uuid.uuid4()),
        'name': data['name'],
        'email': data['email'],
        'password': hashed_password.decode('utf-8'),
        'phone': data['phone'],
        'created_at': datetime.utcnow().isoformat()
    }
    
    users.append(user)
    save_data('users.json', users)
    return jsonify({'message': 'User registered successfully', 'user_id': user['_id']}), 201

# User Login
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    users = load_data('users.json')
    user = next((u for u in users if u['email'] == data['email']), None)
    
    if user and bcrypt.checkpw(data['password'].encode('utf-8'), user['password'].encode('utf-8')):
        token = jwt.encode({
            'user_id': user['_id'],
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'token': token,
            'user': {
                'id': user['_id'],
                'name': user['name'],
                'email': user['email']
            }
        }), 200
    
    return jsonify({'message': 'Invalid credentials'}), 401

# Admin Login
@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    admins = load_data('admins.json')
    admin = next((a for a in admins if a['username'] == data['username']), None)
    
    if admin and bcrypt.checkpw(data['password'].encode('utf-8'), admin['password'].encode('utf-8')):
        token = jwt.encode({
            'admin_id': admin['_id'],
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'token': token,
            'admin': {
                'id': admin['_id'],
                'username': admin['username']
            }
        }), 200
    
    return jsonify({'message': 'Invalid credentials'}), 401

# Get all cars
@app.route('/api/cars', methods=['GET'])
def get_cars():
    cars = load_data('cars.json')
    return jsonify(cars), 200

# Get single car
@app.route('/api/cars/<car_id>', methods=['GET'])
def get_car(car_id):
    cars = load_data('cars.json')
    car = next((c for c in cars if c['_id'] == car_id), None)
    if car:
        return jsonify(car), 200
    return jsonify({'message': 'Car not found'}), 404

# Create booking
@app.route('/api/bookings', methods=['POST'])
@token_required
def create_booking(current_user):
    data = request.get_json()
    cars = load_data('cars.json')
    car = next((c for c in cars if c['_id'] == data['car_id']), None)
    
    if not car:
        return jsonify({'message': 'Car not found'}), 404
    
    if not car.get('available', True):
        return jsonify({'message': 'Car not available'}), 400
    
    start_date = datetime.fromisoformat(data['start_date'])
    end_date = datetime.fromisoformat(data['end_date'])
    days = (end_date - start_date).days + 1
    total_price = car['price_per_day'] * days
    
    booking = {
        '_id': str(uuid.uuid4()),
        'user_id': current_user['_id'],
        'user_name': current_user['name'],
        'user_email': current_user['email'],
        'car_id': data['car_id'],
        'car_name': car['name'],
        'car_model': car['model'],
        'start_date': start_date.isoformat(),
        'end_date': end_date.isoformat(),
        'days': days,
        'total_price': total_price,
        'license_card': data['license_card'],
        'id_card': data['id_card'],
        'status': 'confirmed',
        'created_at': datetime.utcnow().isoformat()
    }
    
    bookings = load_data('bookings.json')
    bookings.append(booking)
    save_data('bookings.json', bookings)
    
    # Update car availability
    for c in cars:
        if c['_id'] == data['car_id']:
            c['available'] = False
    save_data('cars.json', cars)
    
    return jsonify({
        'message': 'Booking created successfully',
        'booking_id': booking['_id'],
        'total_price': total_price
    }), 201

# Get user bookings
@app.route('/api/bookings/user', methods=['GET'])
@token_required
def get_user_bookings(current_user):
    bookings = load_data('bookings.json')
    user_bookings = [b for b in bookings if b['user_id'] == current_user['_id']]
    return jsonify(user_bookings), 200

# Admin: Get all bookings
@app.route('/api/admin/bookings', methods=['GET'])
@admin_token_required
def get_all_bookings(current_admin):
    bookings = load_data('bookings.json')
    return jsonify(bookings), 200

# Admin: Get statistics
@app.route('/api/admin/statistics', methods=['GET'])
@admin_token_required
def get_statistics(current_admin):
    users = load_data('users.json')
    cars = load_data('cars.json')
    bookings = load_data('bookings.json')
    
    total_users = len(users)
    total_cars = len(cars)
    total_bookings = len(bookings)
    available_cars = len([c for c in cars if c.get('available', True)])
    
    # Calculate total revenue
    total_revenue = sum(booking.get('total_price', 0) for booking in bookings)
    
    # Recent bookings
    recent_bookings = sorted(bookings, key=lambda x: x.get('created_at', ''), reverse=True)[:5]
    
    return jsonify({
        'total_users': total_users,
        'total_cars': total_cars,
        'total_bookings': total_bookings,
        'available_cars': available_cars,
        'total_revenue': total_revenue,
        'recent_bookings': recent_bookings
    }), 200

# Serve frontend files
@app.route('/')
def serve_frontend():
    return send_from_directory('../Frontend', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('../Frontend', path)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
