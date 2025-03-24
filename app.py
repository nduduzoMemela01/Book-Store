from flask import Flask, request, jsonify, render_template, redirect, url_for
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import datetime
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)


def add_user_to_database(name, email):
    """Add a new user to the database with the provided name and email."""
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    
    # Create the table if it doesn't exist
    cursor.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT)")
    
    # Insert the user data
    cursor.execute("INSERT INTO users (name, email) VALUES (?, ?)", (name, email))
    
    # Commit changes and close connection
    conn.commit()
    conn.close()
    
    return True













# Simulated User Database
db = [
    {
        "id": '22345678',
        "password": '$$Dut22345678'
    },
]

# Login Verification
@app.route('/')
def home():
    return render_template('Admin.html')

@app.route('/book')
def book():
    return render_template('book.html')  

@app.route('/Admin')
def Admin():
    return render_template('Admin.html')
# Login Verification
@app.route('/index')
def index():
    return render_template('index.html')


@app.route('/verify')
def verify():
    return render_template('verificationpage.html')


@app.route('/login', methods=['POST'])
def login():
    user_data = request.json

    role = user_data['role']
    username = user_data['studentNumber']
    password = user_data['password']

    if role == 'Student':
        if username == '22332973' and password == '$$Dut040617':
            return redirect(location="http://127.0.0.1:5000/book", code=302)
        else:
            return jsonify({'error': 'Invalid Credentials'}), 401
    else:
        if username == '22225371' and password == '$$Admin2025':
            return redirect(location="http://127.0.0.1:5000/Admin", code=302)
        else:
            return jsonify({'error': 'Invalid Credentials'}), 401


if __name__ == '__main__':
    app.run(debug=True)
