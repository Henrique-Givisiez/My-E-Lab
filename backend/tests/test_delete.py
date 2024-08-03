import unittest
import sys
import os
from time import sleep
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
                   
    def test_delete_authorized_user_valid(self):
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
        
        id_to_delete = database.auth.read(login="fulano123")[-1]

        delete_response = self.app.delete(f"/delete/{id_to_delete}", headers=headers)
        self.assertEqual(delete_response.status_code, 200)
        self.assertEqual(delete_response.json, {"success": True, "msg": "Usuário excluído."})


    def test_delete_user_nonexistent_invalid(self):
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

        delete_response = self.app.delete("/delete/-1", headers=headers)
        self.assertEqual(delete_response.status_code, 400)
        self.assertEqual(delete_response.json, {"success": False, "msg": "Usuário inexistente."})

    def test_delete_unauthorized_user_invalid(self):
        response = self.app.post("/signup", json={"name": "Ciclano", "last_name":  "Santos", "login": "ciclano123", "password": "senha", "role": "estudante"})
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.json['success'])
        sleep(2)
        
        login_response = self.app.post("/login", json = {
            "login": "ciclano123", 
            "password": "senha"
        })
        
        self.assertEqual(login_response.status_code, 200)
        self.assertIn('access_token', login_response.json)

        token = login_response.json['access_token']

        headers = {
            "Authorization": f'Bearer {token}'
        }

        delete_response = self.app.delete("/delete", headers=headers)
        self.assertEqual(delete_response.status_code, 403)
        self.assertEqual(delete_response.json, {"success": False, "msg": "Usuário não tem permissão para realizar essa operação."})

if __name__ == "__main__":
    unittest.main()