import os

import requests
import psycopg2
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_jwt_extended import create_access_token, JWTManager, jwt_required, get_jwt_identity
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Initialize JWTManager
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Replace with your own secret key
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
jwt = JWTManager(app)

load_dotenv()  # Load the environment variables from the .env file

GOOGLE_CLIENT_ID = os.environ['GOOGLE_CLIENT_ID']
GOOGLE_SECRET_KEY = os.environ['GOOGLE_SECRET_KEY']

# Database connection
DB_URL = os.environ['DB_URL']
db_url = DB_URL

conn = psycopg2.connect(db_url)

def initialize_user_table():
    with conn.cursor() as cur:
        cur.execute('''
            CREATE TABLE IF NOT EXISTS users (
                username VARCHAR PRIMARY KEY,
                password VARCHAR,
                cameras TEXT[],
                notifications BOOLEAN,
                images TEXT[],
                videos TEXT[],
                contactinfo TEXT[]
            );
        ''')
        conn.commit()

initialize_user_table()


@app.route('/', methods=['GET'])
def hello_world():
    return "hello world"


@app.route('/google_login', methods=['POST'])
def login():
    auth_code = request.get_json()['code']

    data = {
        'code': auth_code,
        'client_id': GOOGLE_CLIENT_ID,  # client ID from the credential at google developer console
        'client_secret': GOOGLE_SECRET_KEY,  # client secret from the credential at google developer console
        'redirect_uri': 'postmessage',
        'grant_type': 'authorization_code'
    }

    response = requests.post('https://oauth2.googleapis.com/token', data=data).json()
    headers = {
        'Authorization': f'Bearer {response["access_token"]}'
    }
    user_info = requests.get('https://www.googleapis.com/oauth2/v3/userinfo', headers=headers).json()
    print(user_info)
    user_email = user_info['email']
    print(user_email)

    """
        check here if user exists in database, if not, add him
    """
    # Check if user exists in the database, if not, add them
    with conn.cursor() as cur:
        print("preverjam ali obstaja user z emailom: ", user_email)
        cur.execute("SELECT username FROM users WHERE username = %s", (user_email,))
        user = cur.fetchone()
        
        if not user:
            print("Dodajam usera z emailom: ", user_email)
            # User does not exist, insert into the database
            cur.execute(
                "INSERT INTO users (username, password, cameras, notifications, images, videos, contactinfo) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                (user_email, '', '{}', False, '{}', '{}', '{}')
            )
            print("USER DODAN")
            conn.commit()

    jwt_token = create_access_token(identity=user_info['email'])  # create jwt token
    response = jsonify(user=user_info)
    response.set_cookie('access_token_cookie', value=jwt_token, secure=True)

    return response, 200


# Protect a route with jwt_required, which will kick out requests
# without a valid JWT present.
@app.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    # Access the identity of the current user with get_jwt_identity
    jwt_token = request.cookies.get('access_token_cookie') # Demonstration how to get the cookie
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
