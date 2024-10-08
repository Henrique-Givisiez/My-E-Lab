import unittest
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '..','..', 'app'))

from app.factory import create_app
app = create_app()

class TestLogin(unittest.TestCase):

    def setUp(self):
        app.config["TESTING"] = True
        self.app = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()
        self.secret_key = "secret_key"

    def tearDown(self) -> None:
        self.app_context.pop()
                        
    def test_login_valid(self):
        response = self.app.post("/auth/login", json = {"login": "fulano123", "password": "senha"})
        self.assertEqual(response.status_code, 200)
        token, msg = response.json['access_token'], response.json['msg']

        self.assertEqual(msg, "Bem-vindo(a), Fulano!")
        self.assertIsInstance(token, str)

    def test_login_invalid_wrong_credentials(self):
        response = self.app.post("/auth/login", json = {"login": "fulano123", "password": "superSenha"})
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json, {"access_token": False, "msg": "Credenciais inválidas."})

    def test_login_invalid_no_fields(self):
        response = self.app.post("/auth/login", json = {})
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json, {"access_token": False, "msg": "Campos incompletos."})

    def test_login_invalid_no_values(self):
        response = self.app.post("/auth/login", json = {"login": None, "password": "senha"})
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json, {"access_token": False, "msg": "Campos incompletos."})


        
if __name__ == "__main__":
    unittest.main()