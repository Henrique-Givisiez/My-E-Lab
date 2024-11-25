from flask_jwt_extended import JWTManager

# Cria um set (estrutura de dados não ordenada e sem duplicatas)
# Uma espécia de "lista" que irá conter os tokens inválidos
token_blocklist = set()

# Cria uma instância JWTManager para gerenciar os tokens JWT
jwt = JWTManager()

# Um decorator que verifica se o token atual está na lista de token inválidos
@jwt.token_in_blocklist_loader
def check_if_token_in_blocklist(jwt_header, jwt_payload):
    return jwt_payload['jti'] in token_blocklist

# Função para adicionar o token à lista de tokens inválidos
def block_token(jti):
    token_blocklist.add(jti)
