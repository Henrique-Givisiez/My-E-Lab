from flask import Blueprint, request, jsonify, render_template
from factory import database
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from flask_cors import cross_origin

pages_bp = Blueprint('/page', __name__)

@pages_bp.route('/signup', methods=['GET'])
@cross_origin()
def load_signup():
    return render_template('signup.html')

@pages_bp.route('/login', methods=['GET'])
@cross_origin()
def load_login():
    return render_template('login.html')

@pages_bp.route('/homepage', methods=['GET'])
@cross_origin()
@jwt_required()
def load_homepage():
    user_id = get_jwt_identity()
    if user_id:
        return render_template('homepage.html')