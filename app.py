from flask import Flask, request, jsonify, render_template, redirect
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

db = [
    {
        "id": '22345678',
        "password": '$$Dut22345678'
    },
]

# Landing page
@app.route('/')
def home():
    return render_template('BkStore.html') 

# Login form redirecting
@app.route('/index')
def index():
    return render_template('index.html') 

# Verification page
@app.route('/verify')
def verify():
    return render_template('verificationpage.html') 

# Auth form validation
@app.route('/login', methods=['POST'])
def login():
    user_data = request.json
    
    role = user_data['role']
    username = user_data['studentNumber']
    password = user_data['password']
    
    if role == 'Student':
        match = username == '22332973' and password == '$$Dut040617'
        if match:
            return redirect(location="http://127.0.0.1:5000/verify", code=302)
        else: 
            return jsonify({ 'error': 'Invalid Credentials'}), 401
    else:
        match = username == '22225371' and password == '$$Admin2025'
        if match:
            return redirect(location="http://127.0.0.1:5000/verify", code=302)
        else: 
            return jsonify({ 'error': 'Invalid Credentials'}), 401         
    
if __name__ == '__main__':
    app.run(debug=True)
