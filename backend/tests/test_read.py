import unittest
import sys
import os

# Adiciona o diretório 'app' ao sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'app'))

# Agora você pode importar o 'factory'
from app.factory import create_app, database

app = create_app()

class TestSignup(unittest.TestCase):

    def setUp(self):
        app.config["TESTING"] = True
        self.app = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()
        self.secret_key = "secret_key"
        self.database = database

    def tearDown(self) -> None:
        self.app_context.pop()
   
    def test_read_id_valid(self):
        login_response = self.app.post("/login", json = {
            "login": "fulano123", 
            "password": "senha"
        })
        
        self.assertEqual(login_response.status_code, 200)
        self.assertIn('access_token', login_response.json)

        token = login_response.json['access_token']

        headers = {
            "Authorization": f'Bearer {token}'
        }
        
        id_to_read = database.auth.read(login="fulano123")[-1]

        read_response = self.app.get(f"/details/{id_to_read}", headers=headers)
        self.assertIsInstance(read_response.json, list)

    def test_read_login_valid(self):
        login_response = self.app.post("/login", json = {
            "login": "fulano123", 
            "password": "senha"
        })
        
        self.assertEqual(login_response.status_code, 200)
        self.assertIn('access_token', login_response.json)

        token = login_response.json['access_token']

        headers = {
            "Authorization": f'Bearer {token}'
        }

        read_response = self.app.get(f"/details/fulano123", headers=headers)
        self.assertIsInstance(read_response.json, list)
        
    def test_read_invalid(self):
        login_response = self.app.post("/login", json = {
            "login": "fulano123", 
            "password": "senha"
        })
        
        self.assertEqual(login_response.status_code, 200)
        self.assertIn('access_token', login_response.json)

        token = login_response.json['access_token']

        headers = {
            "Authorization": f'Bearer {token}'
        }

        read_response = self.app.get("/details/-1", headers=headers)
        self.assertEqual(read_response.status_code, 404)
        self.assertIsNone(read_response.json)

        read_response = self.app.get("/details/hello_world", headers=headers)
        self.assertEqual(read_response.status_code, 404)
        self.assertIsNone(read_response.json)


if __name__ == "__main__":
    unittest.main()