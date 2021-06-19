import os
from flask import Flask, request, redirect
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect, generate_csrf
import requests
from urllib.parse import quote_plus

from .config import Config

app = Flask(__name__)

app.config.from_object(Config)

# Application Security
CORS(app)
CSRFProtect(app)


# Any request made over http is redirected to https.
@app.before_request
def https_redirect():
    if os.environ.get('FLASK_ENV') == 'production':
        if request.headers.get('X-Forwarded-Proto') == 'http':
            url = request.url.replace('http://', 'https://', 1)
            code = 301
            return redirect(url, code=code)


@app.after_request
def inject_csrf_token(response):
    response.set_cookie('csrf_token',
                        generate_csrf(),
                        secure=True if os.environ.get(
                            'FLASK_ENV') == 'production' else False,
                        samesite='Strict' if os.environ.get(
                            'FLASK_ENV') == 'production' else None,
                        httponly=True)
    return response

# Makes initial authorization to Blizzard API and returns parsed auth response
# The access token will be stored in redux on the frontend for subsequent calls
@app.route('/blizz_auth')
def blizz_auth():
    url = 'https://us.battle.net/oauth/token'

    clientId = os.environ.get('BLIZZ_CLIENT_ID')
    clientSecret = os.environ.get('BLIZZ_CLIENT_SECRET')

    payload = {'grant_type': 'client_credentials'}

    res = requests.post(url, auth=requests.auth.HTTPBasicAuth(clientId, clientSecret), data=payload)

    parsed = res.json()

    return parsed


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    # Sets up for favicon usage if changed in future
    if path == 'favicon.ico':
        return app.send_static_file('favicon.ico')
    return app.send_static_file('index.html')
