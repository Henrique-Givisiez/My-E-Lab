# Importa bibliotecas necessárias
from flask import Blueprint, request, jsonify
from factory import database
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from flask_cors import cross_origin

# Utilização de blueprints para encapsular as funcionalidades e viabilizar a modularização
loans_bp = Blueprint('loans', __name__)

# Cadastro de empréstimo
@loans_bp.route('/create', methods=['POST'])
@cross_origin()
@jwt_required()
def create_loan():
    # Busca identificador do usuário no token JWT
    user_id = get_jwt_identity()

    # Usuário não está logado
    if not user_id:
        return jsonify({"success": False, "msg":"Operação não autorizada."}), 401
    try:
        # Recebe dados no formato JSON e tenta cadastrar empréstimo no banco de dados
        data = request.json
        success, msg = database.loans.create(data['item_id'], user_id)

    # Tratamento de erro para ausência de um dos campos
    except KeyError:
        success = False
        msg = "Campos incompletos."
    # Resposta da requisição
    return jsonify({"success": success, "msg": msg}), (201 if success else 400)

# Lê todos os empréstimos por usuário
@loans_bp.route('/read-by-user', methods=['GET'])
@cross_origin()
@jwt_required()
def read_user_loans():
    # Busca identificador do usuário no token JWT
    user_id = get_jwt_identity()
    # Usuário não está logado
    if not user_id:
        return jsonify({"success": False, "msg":"Operação não autorizada."}), 401

    # Lê todos os empréstimos de usuário no banco de dados    
    user_loans = database.loans.read_user_loans(user_id)
    # Resposta da requisição
    return jsonify(user_loans) if user_loans else ({'msg': 'Sem empréstimos.'}, 404)

# Verifica o status do empréstimo
@loans_bp.route('/check-status/<loan_id>', methods=['GET'])
@cross_origin()
@jwt_required()
def check_loan_status(loan_id):
    # Busca identificador do usuário no token JWT
    user_id = get_jwt_identity()
    # Usuário não está logado
    if not user_id:
        return jsonify({"success": False, "msg":"Operação não autorizada."}), 401
    
    # Verifica o status do empréstimo no banco de dados
    loan_status = database.loans.check_status(loan_id)
    # Resposta da requisição
    return jsonify(status=loan_status) if loan_status else ('', 404)


# Renovação de empréstimo
@loans_bp.route('/renew/<loan_id>', methods=['PUT'])
@cross_origin()
@jwt_required()
def renew_loan(loan_id):
    # Busca identificador do usuário no token JWT
    user_id = get_jwt_identity()
    # Usuário não está logado
    if not user_id:
        return jsonify({"success": False, "msg":"Operação não autorizada."}), 401
    
    # Recebe os dados no formato JSON 
    data = request.json
    new_date = data.get('new_date') # Pega o valor da nova data a ser atualizada
    # Tenta atualizar a nova data do empréstimo no banco de dados
    success, msg = database.loans.update(loan_id=loan_id, new_date_return=new_date)

    # Resposta da requisição
    return jsonify({'success': success, 'new_date': new_date, 'msg': msg}), (200 if success else 400)


# Atualiza o empréstimo como devolvido
@loans_bp.route('/return/<loan_id>', methods=['PUT'])
@cross_origin()
@jwt_required()
def return_loan(loan_id):
    # Busca identificador do usuário no token JWT
    user_id = get_jwt_identity()
    # Usuário não está logado
    if not user_id:
        return jsonify({"success": False, "msg":"Operação não autorizada."}), 401
        
    # Tenta atualizar o empréstimo como devolvido no banco de dados
    success, msg = database.loans.return_loan(loan_id)
    # Resposta da requisição
    return jsonify({"success": success, "msg": msg}), (200 if success else 400)

# Exclui um empréstimo
@loans_bp.route('/delete/<loan_id>', methods=['DELETE'])
@cross_origin()
@jwt_required()
def delete_loan(loan_id):
    # Busca identificador e informações do usuário no token JWT
    user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims['role']
    # Usuário não está logado
    if not user_id:
        return jsonify({"success": False, "msg":"Operação não autorizada."}), 401

    # Se o usuário for administrador, ele pode excluir qualquer empréstimo
    if role == 'admin':
        # Tenta excluir empréstimo no banco de dados
        success, msg = database.loans.delete(loan_id)
        # Resposta da requisição
        return jsonify({"success": success, "msg": msg}), (200 if success else 400)

    # Resposta da requisição
    return jsonify(msg="Usuário não tem permissão para realizar essa operação."), 403