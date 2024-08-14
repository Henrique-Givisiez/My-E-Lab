import unittest
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '..','..', 'app'))

from app.factory import create_app
app = create_app()

class TestRenew(unittest.TestCase):

    def setUp(self):
        app.config["TESTING"] = True
        self.app = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()
        self.secret_key = "secret_key"

    def tearDown(self) -> None:
        self.app_context.pop()
                        
    def test_renew_valid(self):
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

        renew_response = self.app.put('/loans/renew/11', headers=headers, json={"new_date": "29/08/2024"})
        
        self.assertEqual(renew_response.status_code, 200)
        self.assertEqual(renew_response.json, {"success": True, "new_date": "29/08/2024", 'msg': 'Empréstimo atualizado com sucesso!'})


    def test_renew_invalid(self):
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

        renew_response = self.app.put('/loans/renew/11', headers=headers, json={"new_date": "01/01/2024"})
        
        self.assertEqual(renew_response.status_code, 400)
        self.assertEqual(renew_response.json, {"success": False, "new_date": "01/01/2024", 'msg': 'A data de devolução deve ser posterior à data do empréstimo.'})
  