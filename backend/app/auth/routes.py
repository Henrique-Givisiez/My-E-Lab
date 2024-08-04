from flask import Blueprint, request, jsonify
from factory import database
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from flask_cors import cross_origin

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
@cross_origin()
def signup():
    data = request.json
    try:
        success, msg = database.auth.create(data['name'], data['last_name'], data['login'], data['password'], data['role'])
    except KeyError:
        success = False
        msg = "Campos faltando."
    return jsonify({"success":success, "msg":msg}), (201 if success else 400)


@auth_bp.route('/login', methods=['POST'])
@cross_origin()
def login():
    data = request.json
    try:
        jwt_token, msg = database.auth.check_login(data['login'], data['password'])
    except KeyError:
        jwt_token = False
        msg = "Campos faltando."
    return jsonify({"access_token": jwt_token, "msg": msg}), (200 if jwt_token else 401)


@auth_bp.route('/details/<user_info>', methods=['GET'])
@jwt_required()
def user_details(user_info):
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify(msg="Operação não autorizada."), 401
    try:
        id_to_read = int(user_info)
        user_data = database.auth.read(user_id=id_to_read)
    except ValueError:
        user_data = database.auth.read(login=user_info)
    finally:
        return jsonify(user_data) if user_data else ('', 404)


@auth_bp.route('/update/<id_to_update>', methods=['PUT'])
@jwt_required()
def update_user(id_to_update):
    user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims["role"]
    if not user_id:
        return jsonify(msg="Operação não autorizada."), 401
        
    if role == "admin":
        data = request.json
        success, msg = database.auth.update(id_to_update, data.get('new_name'), data.get('new_last_name'), data.get('new_password'))
        return jsonify({'success': success, "msg": msg}), (200 if success else 400)

    return jsonify(msg="Usuário não tem permissão para realizar essa operação"), 403


@auth_bp.route('/delete/<id_to_delete>', methods=['DELETE'])
@jwt_required()
def delete_user(id_to_delete):
    user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims["role"]
    if not user_id:
        return jsonify(msg="Operação não autorizada."), 401
    if role == "admin":
        success, msg = database.auth.delete(id_to_delete)
        return jsonify({"success": success, "msg": msg}), (200 if success else 400)
    return jsonify({"success": False, "msg":"Usuário não tem permissão para realizar essa operação."}), 403