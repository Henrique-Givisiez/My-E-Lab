import unittest
import sys
import os
from time import sleep

sys.path.append(os.path.join(os.path.dirname(__file__), '..','..', 'app'))

from app.factory import create_app
app = create_app()

class TestDelete(unittest.TestCase):

    def setUp(self):
        app.config["TESTING"] = True
        self.app = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()
        self.secret_key = "secret_key"

    def tearDown(self) -> None:
        self.app_context.pop()
                        
    def test_delete_valid(self):
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

        delete_response = self.app.delete('/loans/delete/11', headers=headers)
        self.assertEqual(delete_response.status_code, 200)
        self.assertEqual(delete_response.json, {"success": True, "msg": "Empréstimo excluído."})


    def test_delete_invalid(self):
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

        create_response = self.app.post('/loans/create', json = {"item_id": "9788580550979"}, headers=headers)
        self.assertEqual(create_response.status_code, 201)
        self.assertEqual(create_response.json, {"success": True, "msg": "Empréstimo bem sucedido!"})
        sleep(1)

        delete_response = self.app.delete('/loans/delete/12', headers=headers)
        self.assertEqual(delete_response.status_code, 400)
        self.assertEqual(delete_response.json, {'success': False, 'msg': 'Empréstimo do item em andamento. Não foi possível excluir.'})
