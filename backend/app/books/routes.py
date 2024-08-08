from flask import Blueprint, request, jsonify
from factory import database
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from flask_cors import cross_origin

books_bp = Blueprint('books', __name__)

@books_bp.route('/create', methods=['POST'])
@cross_origin()
@jwt_required()
def create_book():
    user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims['role']
    if not user_id:
        return jsonify({"success": False, "msg":"Operação não autorizada."}), 401
    
    if role == "admin" or role == "professor":
        try:
            data = request.json
            success, msg = database.books.create(data['ISBN'], data['title'], data['description'], data['category'], 
                                                 data['date'], data['author'], data['location'], data.get('book_cover'))
        except KeyError:
            success = False
            msg = "Campos incompletos."
        return jsonify({"success":success, "msg":msg}), (201 if success else 400)

    return jsonify({"success": False, "msg": "Usuário não tem permissão para realizar essa operação"}), 403

@books_bp.route('/read-by-isbn/<ISBN>', methods=['GET'])
@cross_origin()
@jwt_required()
def read_book_by_isbn(ISBN):
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify(msg="Operação não autorizada."), 401

    book_data = database.books.read(ISBN) 
    return jsonify(book_data) if book_data else ({"msg": "ISBN não encontrado."}, 404)

@books_bp.route('/read-all', methods=['GET'])
@cross_origin()
@jwt_required()
def read_all_books():
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify(msg="Operação não autorizada."), 401
        
    book_data = database.books.read_all_books()
    return jsonify(book_data) if book_data else ('', 404)

@books_bp.route('/read-by-parameter', methods=['GET'])
@jwt_required()
@cross_origin()
def read_books_by_parameter():
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify(msg="Operação não autorizada."), 401
        
    data = request.json
    books_list = database.books.read_book_by_parameter(data.get('title'), data.get('author'), data.get('ISBN'), 
                                                         data.get('category'), data.get('location'), data.get("date"))

    return jsonify(books_list) if books_list else ('', 404)


@books_bp.route('/update/<ISBN>', methods=['PUT'])
@jwt_required()
@cross_origin()
def update_book(ISBN):
    user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims['role']
    if not user_id:
        return jsonify({"success": False, "msg":"Operação não autorizada."}), 401

    if role == "admin" or role == "professor":
        data = request.json
        success, msg = database.books.update(ISBN, data.get('new_title'), data.get('new_description'), data.get('new_category'),
                                             data.get('new_date'), data.get('new_author'), data.get('new_location'), data.get('new_URI'))
        return jsonify({'success': success, "msg": msg}), (200 if success else 400)

    return jsonify({"success": False, "msg": "Usuário não tem permissão para realizar essa operação"}), 403


@books_bp.route('/delete/<ISBN>', methods=['DELETE'])
@jwt_required()
@cross_origin()
def delete_book(ISBN):
    user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims["role"]
    if not user_id:
        return jsonify(msg="Operação não autorizada."), 401
    
    if role == "admin" or role == "professor":
        success, msg = database.books.delete(ISBN)
        return jsonify({"success": success, "msg": msg}), (200 if success else 400)
    
    return jsonify({"success": False, "msg":"Usuário não tem permissão para realizar essa operação."}), 403