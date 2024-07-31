from flask import Blueprint, request, jsonify, render_template
from factory import database
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import cross_origin

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/', methods=['GET'])
def index():
    return render_template("index.html")

@auth_bp.route('/signup', methods=['POST'])
@cross_origin()
def signup():
    data = request.json
    success = database.auth.create(data['name'], data['last_name'], data['login'], data['password'], data['role'])
    return jsonify({'success': success}), (201 if success else 400)


@auth_bp.route('/login', methods=['POST'])
@cross_origin()
def login():
    data = request.json
    jwt_token = database.auth.check_login(data['login'], data['password'])
    return jsonify({"access_token":jwt_token}), (200 if jwt_token else 401)


@auth_bp.route('/details', methods=['GET'])
@jwt_required()
def user_details():
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify({"msg": "Operação não autorizada"}), 403
    user = database.auth.read(user_id)
    return jsonify(user) if user else ('', 404)


@auth_bp.route('/update', methods=['PUT'])
@jwt_required()
def update_user():
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify({"msg": "Operação não autorizada"}), 403
    data = request.json
    success = database.auth.update(user_id, data.get('new_name'), data.get('new_last_name'), data.get('new_password'))
    return jsonify({'success': success}), (200 if success else 400)


@auth_bp.route('/delete', methods=['DELETE'])
@jwt_required()
def delete_user():
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify({"msg": "Operação não autorizada"}), 403
    success = database.auth.delete(user_id)
    return jsonify({'success': success}), (200 if success else 400)
