import os
from flask import Flask, request, jsonify, render_template, redirect, url_for
from datetime import datetime
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId  # Import ObjectId
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)


# MongoDB connection
mongo_uri = os.getenv('MONGO_URI')
client = MongoClient(mongo_uri)
db = client['bookstoredb']

# Routes
@app.route('/')
def home():
    return render_template('BkStore.html')

@app.route('/book')
def book():
    return render_template('book.html')

@app.route('/admin')
def admin():
    return render_template('Admin.html')

@app.route('/signin')
def signin():
    return render_template('signuppage.html')

@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/cart')
def cart():
    return render_template('cart.html')

@app.route('/signup', methods=['GET'])
def render_signup():
    return render_template('signuppage.html')

@app.route('/signup', methods=['POST'])
def handle_signup():
    users = db['users']
    user_data = request.json

    student_number = user_data.get('studentNumber')
    email = user_data.get('email')
    initials = user_data.get('initials')
    surname = user_data.get('surname')
    password = user_data.get('password')

    # Check if the student number already exists
    if users.find_one({'studentNumber': student_number}):
        return jsonify({'error': 'Student number already exists'}), 400

    # Create a new user
    new_user = {
        'studentNumber': student_number,
        'email': email,
        'initials': initials,
        'surname': surname,
        'password': password,
        'userType': 'Student',  # Default user type
        'cart': [],
        'orders': []
    }

    users.insert_one(new_user)
    return redirect(url_for('index'))

@app.route('/createorder', methods=['POST'])
def create_order():
    orders = db['orders']
    users = db['users']
    data = request.json

    student_number = data.get('studentNumber')
    payment_method = data.get('paymentMethod')  # "EFT" or "Card"

    # Find the user
    user = users.find_one({'studentNumber': student_number})
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Get the cart items
    cart_items = user.get('cart', [])
    if not cart_items:
        return jsonify({'error': 'Cart is empty'}), 400

    # Calculate the total amount
    total_amount = sum(item['price'] * item.get('quantity', 1) for item in cart_items)

    # Create the order
    order = {
        "order_id": f"ORD{ObjectId()}",  # Generate a unique order ID
        "user_id": student_number,
        "items": cart_items,
        "total_amount": total_amount,
        "payment_method": payment_method,
        "payment_status": "Pending",  # Default payment status
        "order_status": "Processing",  # Default order status
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }

    # Insert the order into the database
    orders.insert_one(order)

    # Clear the user's cart
    users.update_one({'studentNumber': student_number}, {'$set': {'cart': []}})

    return jsonify({'message': 'Order created successfully', 'order_id': order['order_id']}), 201

@app.route('/loadbooks', methods=['GET'])
def load_books():
    books = db['books']
    faculty = request.args.get('faculty')
    bestseller = request.args.get('bestseller')
    search_query = request.args.get('search')

    query = {}

    # Filter by faculty
    if faculty:
        query['faculty'] = faculty

    # Filter by bestseller (badge field)
    if bestseller and bestseller.lower() == 'true':
        query['badge'] = 'Bestseller'

    # Search by title, author, or book_id
    if search_query:
        query['$or'] = [
            {'title': {'$regex': search_query, '$options': 'i'}},
            {'author': {'$regex': search_query, '$options': 'i'}},
            {'book_id': {'$regex': search_query, '$options': 'i'}}
        ]

    book_list = list(books.find(query))
    for book in book_list:
        book['_id'] = str(book['_id'])  # Convert ObjectId to string

    return jsonify(book_list)

@app.route('/addtocart', methods=['POST'])
def add_to_cart():
    users = db['users']
    data = request.json

    student_number = data.get('studentNumber')
    book_id = data.get('bookId')

    user = users.find_one({'studentNumber': student_number})
    if not user:
        return jsonify({'error': 'User not found'}), 404

    cart_item = {
        'book_id': book_id,
        'quantity': 1,
        'added_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }

    users.update_one(
        {'studentNumber': student_number},
        {'$push': {'cart': cart_item}}
    )

    return jsonify({'message': 'Book added to cart successfully'}), 200

@app.route('/getcart', methods=['GET'])
def get_cart():
    student_number = request.args.get('studentNumber')
    users = db['users']

    user = users.find_one({'studentNumber': student_number})
    if not user:
        return jsonify({'cart': []})

    return jsonify({'cart': user.get('cart', [])})

@app.route('/removefromcart', methods=['POST'])
def remove_from_cart():
    users = db['users']
    data = request.json

    student_number = data.get('studentNumber')
    book_id = data.get('bookId')

    # Ensure both `studentNumber` and `bookId` are provided
    if not student_number or not book_id:
        return jsonify({'error': 'Missing studentNumber or bookId'}), 400

    # Remove the book from the user's cart
    result = users.update_one(
        {'studentNumber': student_number},
        {'$pull': {'cart': {'book_id': book_id}}}
    )

    if result.modified_count > 0:
        return jsonify({'message': 'Book removed from cart successfully'}), 200
    else:
        return jsonify({'error': 'Book not found in cart or user not found'}), 404
@app.route('/login', methods=['POST'])
def login():
    users = db['users']
    user_data = request.json

    username = user_data['studentNumber']
    password = user_data['password']

    found_user = users.find_one({'studentNumber': username, 'password': password})

    if not found_user:
        return jsonify({'error': 'User not found'}), 401

    if found_user['userType'] == 'Student':
        return redirect(url_for('book'))
    elif found_user['userType'] == 'Admin':
        return redirect(url_for('admin'))
    else:
        return jsonify({'error': 'Invalid Credentials'}), 401

if __name__ == '__main__':
    app.run(debug=True)