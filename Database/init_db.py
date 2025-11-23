# Initialize MongoDB database with sample data
from pymongo import MongoClient
import bcrypt
from datetime import datetime

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['car_rental_db']

# Collections
users_collection = db['users']
cars_collection = db['cars']
bookings_collection = db['bookings']
admins_collection = db['admins']

def init_database():
    print("Initializing database...")
    
    # Clear existing data
    users_collection.delete_many({})
    cars_collection.delete_many({})
    bookings_collection.delete_many({})
    admins_collection.delete_many({})
    
    # Create admin account
    admin_password = bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt())
    admin = {
        'username': 'admin',
        'password': admin_password,
        'created_at': datetime.utcnow()
    }
    admins_collection.insert_one(admin)
    print("Admin account created (username: admin, password: admin123)")
    
    # Sample cars data
    cars = [
        {
            'name': 'Tesla Model 3',
            'model': '2024',
            'category': 'Electric',
            'price_per_day': 150,
            'seats': 5,
            'transmission': 'Automatic',
            'fuel_type': 'Electric',
            'image': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
            'features': ['GPS', 'Bluetooth', 'Backup Camera', 'Autopilot'],
            'available': True,
            'description': 'Experience the future of driving with the Tesla Model 3.'
        },
        {
            'name': 'BMW X5',
            'model': '2023',
            'category': 'SUV',
            'price_per_day': 200,
            'seats': 7,
            'transmission': 'Automatic',
            'fuel_type': 'Gasoline',
            'image': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
            'features': ['GPS', 'Leather Seats', 'Sunroof', 'All-Wheel Drive'],
            'available': True,
            'description': 'Luxury SUV perfect for family trips and adventures.'
        },
        {
            'name': 'Mercedes-Benz C-Class',
            'model': '2024',
            'category': 'Sedan',
            'price_per_day': 180,
            'seats': 5,
            'transmission': 'Automatic',
            'fuel_type': 'Gasoline',
            'image': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
            'features': ['GPS', 'Premium Sound', 'Heated Seats', 'Parking Assist'],
            'available': True,
            'description': 'Elegant and powerful sedan for business and leisure.'
        },
        {
            'name': 'Audi A4',
            'model': '2023',
            'category': 'Sedan',
            'price_per_day': 160,
            'seats': 5,
            'transmission': 'Automatic',
            'fuel_type': 'Gasoline',
            'image': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
            'features': ['GPS', 'Bluetooth', 'Cruise Control', 'LED Lights'],
            'available': True,
            'description': 'Sophisticated German engineering meets modern design.'
        },
        {
            'name': 'Range Rover Sport',
            'model': '2024',
            'category': 'SUV',
            'price_per_day': 250,
            'seats': 5,
            'transmission': 'Automatic',
            'fuel_type': 'Hybrid',
            'image': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
            'features': ['GPS', 'Premium Interior', 'Off-Road Mode', 'Panoramic Roof'],
            'available': True,
            'description': 'Ultimate luxury SUV for any terrain.'
        },
        {
            'name': 'Toyota Camry',
            'model': '2023',
            'category': 'Sedan',
            'price_per_day': 100,
            'seats': 5,
            'transmission': 'Automatic',
            'fuel_type': 'Hybrid',
            'image': 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
            'features': ['GPS', 'Bluetooth', 'Backup Camera', 'Fuel Efficient'],
            'available': True,
            'description': 'Reliable and fuel-efficient sedan for everyday use.'
        },
        {
            'name': 'Honda CR-V',
            'model': '2024',
            'category': 'SUV',
            'price_per_day': 130,
            'seats': 5,
            'transmission': 'Automatic',
            'fuel_type': 'Gasoline',
            'image': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
            'features': ['GPS', 'Apple CarPlay', 'Spacious Cargo', 'Safety Features'],
            'available': True,
            'description': 'Versatile SUV perfect for families and road trips.'
        },
        {
            'name': 'Porsche 911',
            'model': '2024',
            'category': 'Sports',
            'price_per_day': 400,
            'seats': 2,
            'transmission': 'Automatic',
            'fuel_type': 'Gasoline',
            'image': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
            'features': ['High Performance', 'Sport Mode', 'Premium Audio', 'Racing Seats'],
            'available': True,
            'description': 'Iconic sports car delivering unmatched performance.'
        }
    ]
    
    cars_collection.insert_many(cars)
    print(f"Inserted {len(cars)} sample cars")
    
    # Create indexes
    users_collection.create_index('email', unique=True)
    admins_collection.create_index('username', unique=True)
    
    print("Database initialization complete!")
    print("\nDefault Admin Credentials:")
    print("Username: admin")
    print("Password: admin123")

if __name__ == '__main__':
    init_database()
