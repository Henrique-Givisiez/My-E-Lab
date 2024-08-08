import unittest
import sys
import os

# Adiciona o diretório 'app' ao sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), '..','..', 'app'))

# Agora você pode importar o 'factory'
from app.factory import create_app
app = create_app()

class TestSignup(unittest.TestCase):

    def setUp(self):
        app.config["TESTING"] = True
        self.app = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()
        self.secret_key = "secret_key"

    def tearDown(self) -> None:
        self.app_context.pop()
                         
    def test_signup_valid(self):
        response = self.app.post("/auth/signup", json={"name": "Fulano", "last_name":  "Silva", "login": "fulano123", "password": "senha", "role": "admin", "gender": "m", "profile_img": ""})
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.json['success'])

    def test_signup_invalid_no_fields(self):
        response = self.app.post("/auth/signup", json = {})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json, {"success": False, "msg": "Campos incompletos."})

    def test_signup_invalid_no_values(self):
        response = self.app.post("/auth/signup", json = {"name": "Fulano", "last_name": None, "login": "fulano123", "password": "senha", "role": "admin", "gender": "m"})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json, {"success": False, "msg": "Campos incompletos."})

        
if __name__ == "__main__":
    unittest.main()