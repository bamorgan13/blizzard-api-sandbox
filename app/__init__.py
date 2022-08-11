import os
from flask import Flask, request, redirect
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect, generate_csrf
import requests

from .config import Config

app = Flask(__name__, static_folder='./static', static_url_path='/static')

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


    redirect_uri =  os.environ.get('REDIRECT_URI_PRODUCTION') if os.environ.get('FLASK_ENV') == 'production' else os.environ.get('REDIRECT_URI_DEVELOPMENT')
    client_id = os.environ.get('BLIZZ_CLIENT_ID')
    client_secret = os.environ.get('BLIZZ_CLIENT_SECRET')
    auth_code = request.args.get('code')


    payload = {
        'redirect_uri': redirect_uri,
        'scope': 'openid wow.profile',
        'grant_type': 'authorization_code',
        'code': auth_code
    } if auth_code else {'grant_type': 'client_credentials'}

    res = requests.post(url, auth=requests.auth.HTTPBasicAuth(client_id, client_secret), data=payload)

    parsed = res.json()

    if 'scope' in parsed:
        access_token = parsed['access_token']
        account_res = requests.get(f'https://us.battle.net/oauth/userinfo?access_token={access_token}')
        account_res_parsed = account_res.json()
        account_name = account_res_parsed['battletag']
        parsed['account_name'] = account_name
        return parsed
    else:
        return parsed


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    if path and os.path.exists(f'./{path}'):
        return app.send_static_file(path)
    return app.send_static_file('index.html')
