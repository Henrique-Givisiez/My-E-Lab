from flask import Flask, g
from flask_jwt_extended import JWTManager
from database.conn_database import Database
from flask_cors import CORS
from auth.auth import jwt

database = Database()

def create_app():
    app = Flask(__name__)

    CORS(app)
    app.config['MYSQL_HOST'] = 'localhost'
    app.config['MYSQL_PORT'] = '3306'
    app.config['MYSQL_USER'] = 'myuser'
    app.config['MYSQL_PASSWORD'] = 'mypassword'
    app.config['MYSQL_DB'] = 'bd2023'
    app.config['SECRET_KEY'] = "secret_key"
    app.config['JWT_SECRET_KEY'] = 'secret_key'
    jwt.init_app(app)
    
    @app.before_request
    def before_request():
        g.db = Database()

    @app.teardown_request
    def teardown_request(err):
        if err:
            print(f"ERROR: {err}")

        db = getattr(g, 'db', None)
        if db is not None:
            db.close()

    from auth.routes import auth_bp
    from books.routes import books_bp
    from loans.routes import loans_bp
    from materials.routes import materials_bp
    from items.routes import items_bp
    
    app.register_blueprint(auth_bp, url_prefix=f'/{auth_bp.name}')
    app.register_blueprint(books_bp, url_prefix=f'/{books_bp.name}')
    app.register_blueprint(loans_bp, url_prefix=f"/{loans_bp.name}")
    app.register_blueprint(materials_bp, url_prefix=f"/{materials_bp.name}")
    app.register_blueprint(items_bp, url_prefix=f"/{items_bp.name}")
    return app
