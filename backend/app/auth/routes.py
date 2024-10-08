from flask import Blueprint, request, jsonify
from factory import database
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from flask_cors import cross_origin

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
@cross_origin()
def signup():
    data = request.form
    profile_img = request.files.get('profile_img')
    
    profile_img_data = None
    if profile_img:
        profile_img_data = profile_img.read() 

    try:
        data = dict(data)
        for key, value in data.items():
            data[key] = value.strip()

        success, msg = database.auth.create(
            data['name'],
            data['last_name'],
            data['email'],
            data['password'],
            data['role'],
            data['gender'],
            profile_img_data  
        )    
    except KeyError:
        success = False
        msg = "Campos incompletos."
    return jsonify({"success":success, "msg":msg}), (201 if success else 400)


@auth_bp.route('/login', methods=['POST'])
@cross_origin()
def login():
    data = request.json
    try:
        jwt_token, msg = database.auth.check_login(data['email'], data['password'])
    except KeyError:
        jwt_token = False
        msg = "Campos incompletos."
    return jsonify({"access_token": jwt_token, "msg": msg}), (200 if jwt_token else 401)

@auth_bp.route('/all-users', methods=['GET'])
@jwt_required()
@cross_origin()
def read_all_uses():
    user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims["role"]
    if not user_id:
        return jsonify(msg="Operação não autorizada."), 401
    if role == "admin":
        all_users = database.auth.read_all()
        return jsonify(data=all_users)
    return jsonify(msg="Usuário não tem permissão para realizar essa operação."), 403

@auth_bp.route('/details/<user_info>', methods=['GET'])
@jwt_required()
@cross_origin()
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
        return jsonify(data=user_data) if user_data else ('', 404)


@auth_bp.route('/update/<id_to_update>', methods=['PUT'])
@jwt_required()
@cross_origin()
def update_user(id_to_update):
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify(msg="Operação não autorizada."), 401
    
    data = request.form

    print(data)
    new_name = data['new_name'] if 'new_name' in data else None
    new_last_name = data['new_last_name'] if 'new_last_name' in data else None
    new_password = data['new_password'] if 'new_password' in data else None
    new_gender = data['new_gender'] if 'new_gender' in data else None
    new_role = data['new_role'] if 'new_role' in data else None
    new_email = data['new_email'] if 'new_email' in data else None
    profile_img = data['new_profile_img'] if 'new_profile_img' in data else None
    profile_img_data = None
    if profile_img:
        profile_img_data = profile_img.read() 
        
    success, msg = database.auth.update(id_to_update, new_name, new_last_name, new_password,
                                         profile_img_data, new_gender, new_role, new_email)
    return jsonify({'success': success, "msg": msg}), (200 if success else 400)



@auth_bp.route('/delete/<id_to_delete>', methods=['DELETE'])
@jwt_required()
@cross_origin()
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

@auth_bp.route('/confirm_password', methods=['POST'])
@jwt_required()
@cross_origin()
def confirm_password():
    user_id = get_jwt_identity()
    data = request.json
    password = data['confirm_password']
    success= database.auth.confirm_password(user_id, password)
    return jsonify(success=success), (200 if success else 401)