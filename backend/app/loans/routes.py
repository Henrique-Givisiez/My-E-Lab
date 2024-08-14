from flask import Blueprint, request, jsonify
from factory import database
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from flask_cors import cross_origin

loans_bp = Blueprint('loans', __name__)

@loans_bp.route('/create', methods=['POST'])
@cross_origin()
@jwt_required()
def create_loan():
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify({"success": False, "msg":"Operação não autorizada."}), 401
    try:
        data = request.json
        success, msg = database.loans.create(data['item_id'], user_id)

    except KeyError:
        success = False
        msg = "Campos incompletos."

    return jsonify({"success": success, "msg": msg}), (201 if success else 400)


@loans_bp.route('/read-by-user', methods=['GET'])
@cross_origin()
@jwt_required()
def read_user_loans():
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify({"success": False, "msg":"Operação não autorizada."}), 401
    
    user_loans = database.loans.read_user_loans(user_id)
    return jsonify(user_loans) if user_loans else ({'msg': 'Usuário inválido.'}, 404)


@loans_bp.route('/read-loan/<loan_id>', methods=['GET'])
@cross_origin()
@jwt_required()
def read_loan(loan_id):
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify({"success": False, "msg":"Operação não autorizada."}), 401

    loan_data = database.loans.read_loan(loan_id)
    return jsonify(loan_data) if loan_data else ({'msg': 'Empréstimo não encontrado.'}, 404)


@loans_bp.route('/check-status/<loan_id>', methods=['GET'])
@cross_origin()
@jwt_required()
def check_loan_status(loan_id):
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify({"success": False, "msg":"Operação não autorizada."}), 401
    
    loan_status = database.loans.check_status(loan_id)
    return jsonify(status=loan_status) if loan_status else ('', 404)


@loans_bp.route('/renew/<loan_id>', methods=['PUT'])
@cross_origin()
@jwt_required()
def renew_loan(loan_id):
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify({"success": False, "msg":"Operação não autorizada."}), 401
    
    data = request.json
    new_date = data.get('new_date')
    success, msg = database.loans.update(loan_id=loan_id, new_date_return=new_date)

    return jsonify({'success': success, 'new_date': new_date, 'msg': msg}), (200 if success else 400)


@loans_bp.route('/return/<loan_id>', methods=['PUT'])
@cross_origin()
@jwt_required()
def return_loan(loan_id):
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify({"success": False, "msg":"Operação não autorizada."}), 401
    
    success, msg = database.loans.return_loan(loan_id)

    return jsonify({"success": success, "msg": msg}), (200 if success else 400)


@loans_bp.route('/delete/<loan_id>', methods=['DELETE'])
@cross_origin()
@jwt_required()
def delete_loan(loan_id):
    user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims['role']
    if not user_id:
        return jsonify({"success": False, "msg":"Operação não autorizada."}), 401

    if role == 'admin':
        success, msg = database.loans.delete(loan_id)
        return jsonify({"success": success, "msg": msg}), (200 if success else 400)

    return jsonify({"success": False, "msg":"Usuário não tem permissão para realizar essa operação."}), 403