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

@app.route('/signup')
def signin():
    return render_template('signuppage.html')

@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/cart')
def cart():
    return render_template('cart.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/checkout')
def checkout():
    return render_template('checkoutpage.html')

@app.route('/loadcheckout')
def load_checkout():
    return redirect(url_for('checkout'))

@app.route('/successful')
def successful():
    return render_template('verificationpage.html')

# @app.route('/signup', methods=['GET'])
# def render_signup():
#     return render_template('signuppage.html')

@app.route('/newuser', methods=['POST'])
def handle_signup():
    users = db['users']
    user_data = request.json

    student_number = user_data.get('studentNumber')
    email = user_data.get('email')
    initials = user_data.get('initials')
    surname = user_data.get('surname')
    password = user_data.get('password')
    is_main = user_data.get('main', True)

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
        'userType': 'Student' if is_main else 'Admin',  # Default user type
        'cart': [],
    }

    users.insert_one(new_user)
    
    if is_main:
        return redirect(url_for('index'))
    else:
        return jsonify({'message': 'User created successfully'}), 201

@app.route('/newcheckout', methods=['POST'])
def handle_checkout():
    orders = db['orders']
    # Get JSON data from the request
    data = request.json
    student_number = data.get('studentNumber')
    fullname = data.get('fullname')
    cellphone = data.get('cellphone')
    deliveryaddress = data.get('deliveryaddress')
    nameoncard = data.get('nameoncard')
    creditcard_number = data.get('creditcard_number')
    expmonth = data.get('expmonth')
    expyear = data.get('expyear')
    cvv = data.get('cvv')
    
    users = db['users']
    # Find the user cart by student number
    found_user = users.find_one({'studentNumber': student_number})
    if not found_user:
        return jsonify({'error': 'User not found'}), 404
    
    user_cart = found_user.get('cart', [])
    if not user_cart:
        return jsonify({'error': 'Cart is empty'}), 400

    # Save the order to the database
    order = {
        'FullName': fullname,
        'cellphone': cellphone,
        'deliveryaddress': deliveryaddress,
        'NameonCard': nameoncard,
        'Creditcard_umber': creditcard_number,
        'ExpMonth': expmonth,
        'ExpYear': expyear,
        'Cvv': cvv,
        'orderedBooks': user_cart,
        'studentNumber': student_number,
    }
    orders.insert_one(order)

    # Return a success response
    return redirect(url_for('successful'))

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
    
    return jsonify({'cart': user.get('cart', []), 'user': user.get('studentNumber')})

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
        return redirect(url_for('book', studentNumber=found_user['studentNumber']))
    elif found_user['userType'] == 'Admin':
        return redirect(url_for('admin'))
    else:
        return jsonify({'error': 'Invalid Credentials'}), 401

@app.route('/addsbook', methods=['POST'])
def handle_book():
    books = db['books']
    # Get JSON data from the request
    data = request.json
    print('Request arrived')
    title = data.get('title')
    author = data.get('author')
    price = data.get('price')
    faculty = data.get('faculty')
    badge = data.get('badge')
    cover_url = data.get('cover_url')
    book_id = data.get('book_id')

    # Save the order to the database
    book = {
        'title': title,
        'author': author,
        'price': price,
        'faculty': faculty,
        'badge': badge,
        'cover_url': cover_url,
    }
    books.insert_one(book)

    # Return a success response
    return jsonify({'message': 'Book created successfully'}), 201

@app.route('/loadorders', methods=['GET'])
def load_orders():
    orders = db['orders']
    books = db['books']
    order_list = list(orders.find())

    for order in order_list:
        # Convert ObjectId to string
        order['_id'] = str(order['_id'])

        # Retrieve book titles for each book_id in orderedBooks
        if 'orderedBooks' in order:
            book_titles = []
            total_amount = 0
            for book in order['orderedBooks']:
                book_id = book.get('book_id')
                print(book_id)
                # Skip if book_id is undefined or cannot be converted to int
                if not book_id or book_id == 'undefined':
                    continue
                try:
                    book_id_int = int(book_id)
                except (ValueError, TypeError):
                    continue
                # Find the book in the books collection
                book_data = books.find_one({'book_id': book_id_int}, {'title': 1, 'price': 1, '_id': 0})
                if book_data:
                    book_titles.append(book_data['title'])
                    total_amount += book_data['price'] * book.get('quantity', 1)

            # Add the book titles to the order
            order['book_titles'] = book_titles
            order['total_amount'] = total_amount
            

    return jsonify(order_list)

# @app.route('/createorder', methods=['POST'])
# def create_order():
#     orders = db['orders']
#     users = db['users']
#     data = request.json

#     student_number = data.get('studentNumber')
#     payment_method = data.get('paymentMethod')  # "EFT" or "Card"

#     # Find the user
#     user = users.find_one({'studentNumber': student_number})
#     if not user:
#         return jsonify({'error': 'User not found'}), 404

#     # Get the cart items
#     cart_items = user.get('cart', [])
#     if not cart_items:
#         return jsonify({'error': 'Cart is empty'}), 400

#     # Calculate the total amount
#     total_amount = sum(item['price'] * item.get('quantity', 1) for item in cart_items)

#     # Create the order
#     order = {
#         "order_id": f"ORD{ObjectId()}",  # Generate a unique order ID
#         "user_id": student_number,
#         "items": cart_items,
#         "total_amount": total_amount,
#         "payment_method": payment_method,
#         "payment_status": "Pending",  # Default payment status
#         "order_status": "Processing",  # Default order status
#         "created_at": datetime.utcnow().isoformat(),
#         "updated_at": datetime.utcnow().isoformat()
#     }

#     # Insert the order into the database
#     orders.insert_one(order)

#     # Clear the user's cart
#     users.update_one({'studentNumber': student_number}, {'$set': {'cart': []}})

#     return jsonify({'message': 'Order created successfully', 'order_id': order['order_id']}), 201

# Connect to MongoDB

if __name__ == '__main__':
    app.run(debug=True)










