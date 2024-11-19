from flask import Blueprint, request, jsonify
from factory import database
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from flask_cors import cross_origin

items_bp = Blueprint('items', __name__)

@items_bp.route('/register', methods=['POST'])
@cross_origin()
@jwt_required()
def register_item():
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify({"success": False, "msg":"Operação não autorizada."}), 401
    try:
        data = request.form 
        data = dict(data)
        for key, value in data.items():
            data[key] = value.strip()

        item_img = request.files.get('item_img')
    
        item_img_data = None
        if item_img:
            item_img_data = item_img.read() 

        
        id_item = None
        item_type = data['item_type']
        if item_type == 'book':
            success, msg = database.books.create(data['ISBN'], data['title'], data['description'], 
                                                 data['category'], data['date'], data['author'], 
                                                 data['location'], item_img_data)
            if success:
                id_item = data['ISBN']
        else:
            success, msg = database.materials.create(data['serial_number'], data['name'], data['description'], 
                                                     data['category'], data['date'], data['location'],
                                                     item_img_data)
            if success:
                id_item = data['serial_number']

        try:
            success, msg = database.items.create(id_item, item_type)
        except Exception as err:
            success = False
            msg = str(err)
        return jsonify({"success": success, "msg": msg}), (201 if success else 400)

    except KeyError:
        success = False
        msg = "Campos incompletos."

    return jsonify({"success": success, "msg": msg}), (201 if success else 400)


@items_bp.route('/read-all', methods=['GET'])
@cross_origin()
@jwt_required()
def read_all_items():
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify({"success": False, "msg":"Operação não autorizada."}), 401
    
    all_items = database.items.read_all_items()
    return jsonify(all_items) if all_items else ({'msg': 'Não há items cadastrados.'}, 404)

@items_bp.route('/read-item/<item_id>', methods=['GET'])
@cross_origin
@jwt_required
def read_item(item_id):
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify({"success": False, "msg":"Operação não autorizada."}), 401
        
    item_data = database.items.read_item(item_id)
    return jsonify(item_data) if item_data else ({'msg': 'Item não encontrado.'}, 404)