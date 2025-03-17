from flask import Blueprint, request, jsonify
from factory import database
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from flask_cors import cross_origin

items_bp = Blueprint('items', __name__)

@items_bp.route('/register', methods=['POST','GET'])
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
        item_img = request.files.get('img')
    
        item_img_data = None
        if item_img:
            item_img_data = item_img.read() 

        
        item_type = data['item_type']
        if item_type == 'book':
            success, msg = database.books.create(data['ISBN'], data['title'], data['description'], 
                                                data['category'], data['date'], data['author'], 
                                                data['location'], item_img_data)
                
        else:
            success, msg = database.materials.create(data['serial_number'], data['name'], data['description'], 
                                                    data['category'], data['date'], data['location'],
                                                    item_img_data)
            
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
    
    book_data = database.books.read_all_books()
    if not book_data:
        book_data = []
    materials_data = database.materials.read_all_materials()
    if not materials_data:
        materials_data = []
    items_data = book_data + materials_data
    return jsonify(data=items_data) if items_data else ({'msg': 'Não há items cadastrados.'}, 404)

@items_bp.route('/read/<type>/<id>', methods=['GET'])
@cross_origin()
@jwt_required()
def read_item(type, id):
    user_id = get_jwt_identity()
    
    if not user_id:
        return jsonify({"success": False, "msg":"Operação não autorizada."}), 401
    if type == 'Livro':
        data = database.books.read(ISBN=id)
    else:
        data = database.materials.read(serial_number=id)

    return jsonify(data=data) if data else ({'msg': 'Item não encontrado.'}, 404)