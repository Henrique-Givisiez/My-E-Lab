from flask import Blueprint, request, jsonify
from factory import database
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from flask_cors import cross_origin

materials_bp = Blueprint('materials', __name__)

@materials_bp.route('/create', methods=['POST'])
@cross_origin()
@jwt_required()
def create_material():
    user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims['role']
    if not user_id:
        return jsonify({"success": False, "msg":"Operação não autorizada."}), 401
    
    if role == "admin" or role == "professor":
        try:
            data = request.json
            success, msg = database.materials.create(data['serial_number'], data['name'], data['description'], data['category'], 
                                                 data['date'], data['location'], data.get('material_img'))
        except KeyError:
            success = False
            msg = "Campos incompletos."
        return jsonify({"success":success, "msg":msg}), (201 if success else 400)

    return jsonify({"success": False, "msg": "Usuário não tem permissão para realizar essa operação"}), 403

@materials_bp.route('/read-by-serial-number/<serial_number>', methods=['GET'])
@cross_origin()
@jwt_required()
def read_material_by_isbn(serial_number):
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify(msg="Operação não autorizada."), 401

    material_data = database.materials.read(serial_number) 
    return jsonify(material_data) if material_data else ({"msg": "Número de seérie não encontrado."}, 404)

@materials_bp.route('/read-all', methods=['GET'])
@cross_origin()
@jwt_required()
def read_all_materials():
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify(msg="Operação não autorizada."), 401
        
    material_data = database.materials.read_all_materials()
    return jsonify(material_data) if material_data else ('', 404)

@materials_bp.route('/read-by-parameter', methods=['GET'])
@jwt_required()
@cross_origin()
def read_materials_by_parameter():
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify(msg="Operação não autorizada."), 401
        
    data = request.json
    materials_list = database.materials.read_material_by_parameter(data.get('name'), data.get('serial_number'), 
                                                         data.get('category'), data.get('location'), data.get("date"))

    return jsonify(materials_list) if materials_list else ('', 404)


@materials_bp.route('/update/<serial_number>', methods=['PUT'])
@jwt_required()
@cross_origin()
def update_material(serial_number):
    user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims['role']
    if not user_id:
        return jsonify({"success": False, "msg":"Operação não autorizada."}), 401

    if role == "admin" or role == "professor":
        data = request.json
        success, msg = database.materials.update(serial_number, data.get('new_name'), data.get('new_description'), data.get('new_category'),
                                             data.get('new_date'), data.get('new_location'), data.get('new_material_img'))
        return jsonify({'success': success, "msg": msg}), (200 if success else 400)

    return jsonify({"success": False, "msg": "Usuário não tem permissão para realizar essa operação"}), 403


@materials_bp.route('/delete/<serial_number>', methods=['DELETE'])
@jwt_required()
@cross_origin()
def delete_material(serial_number):
    user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims["role"]
    if not user_id:
        return jsonify(msg="Operação não autorizada."), 401
    
    if role == "admin" or role == "professor":
        success, msg = database.materials.delete(serial_number)
        return jsonify({"success": success, "msg": msg}), (200 if success else 400)
    
    return jsonify({"success": False, "msg":"Usuário não tem permissão para realizar essa operação."}), 403