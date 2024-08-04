import unittest
import sys
import os

# Adiciona o diretório 'app' ao sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'app'))

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

    def test_update_valid(self):
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
        id_to_update = 20

        update_response = self.app.put(f'/update/{id_to_update}', headers=headers, json = {
            "new_name": "Fulano supremo"
        })

        self.assertEqual(update_response.status_code, 200)
        self.assertEqual(update_response.json, {"success": True, "msg": "Usuário atualizado com sucesso."})

    def test_update_invalid(self):
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

        id_to_update = 20

        update_response = self.app.put(f'/update/{id_to_update}', headers=headers, json = {
            "new_name": "",
            "new_password": "",
            "new_last_name": ""
        })

        self.assertEqual(update_response.status_code, 400)
        self.assertEqual(update_response.json, {"success": False, "msg": "Informações não fornecidas."})


if __name__ == "__main__":
    unittest.main()