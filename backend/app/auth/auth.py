from flask_jwt_extended import JWTManager

token_blocklist = set()

jwt = JWTManager()

@jwt.token_in_blocklist_loader
def check_if_token_in_blocklist(jwt_header, jwt_payload):
    return jwt_payload['jti'] in token_blocklist

def block_token(jti):
    token_blocklist.add(jti)
