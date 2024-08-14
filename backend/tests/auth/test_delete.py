import unittest
import sys
import os
from time import sleep

sys.path.append(os.path.join(os.path.dirname(__file__), '..','..', 'app'))

from app.factory import create_app, database
app = create_app()

class TestDelete(unittest.TestCase):

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
        login_response = self.app.post("/auth/login", json = {
            "login": "fulano123", 
            "password": "senha"
        })
        
        self.assertEqual(login_response.status_code, 200)
        self.assertIn('access_token', login_response.json)

        token = login_response.json['access_token']

        headers = {
            "Authorization": f'Bearer {token}'
        }
        
        id_to_delete = database.auth.read(login="fulano123")[0]

        delete_response = self.app.delete(f"/auth/delete/{id_to_delete}", headers=headers)
        self.assertEqual(delete_response.status_code, 200)
        self.assertEqual(delete_response.json, {"success": True, "msg": "Usuário excluído."})

    def test_delete_unauthorized_user_invalid(self):
        response = self.app.post("/auth/signup", json={"name": "Ciclano", "last_name":  "Santos", "login": "ciclano123", "password": "senha", "role": "estudante", "gender": "m", "profile_img": ""})
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.json['success'])
        sleep(2)
        
        login_response = self.app.post("/auth/login", json = {
            "login": "ciclano123", 
            "password": "senha"
        })
        
        self.assertEqual(login_response.status_code, 200)
        self.assertIn('access_token', login_response.json)

        token = login_response.json['access_token']
        id_to_delete = database.auth.read(login="ciclano123")[0]
        headers = {
            "Authorization": f'Bearer {token}'
        }

        delete_response = self.app.delete(f"/auth/delete/{id_to_delete}", headers=headers)
        self.assertEqual(delete_response.status_code, 403)
        self.assertEqual(delete_response.json, {"success": False, "msg": "Usuário não tem permissão para realizar essa operação."})

if __name__ == "__main__":
    unittest.main()