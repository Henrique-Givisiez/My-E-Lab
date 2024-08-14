import unittest
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '..','..', 'app'))

from app.factory import create_app
app = create_app()

class TestRead(unittest.TestCase):

    def setUp(self):
        app.config["TESTING"] = True
        self.app = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()
        self.secret_key = "secret_key"

    def tearDown(self) -> None:
        self.app_context.pop()
        
    def test_read_serial_number_valid(self):
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

        read_response = self.app.get("/materials/read-by-serial-number/1452789630", headers=headers)
        self.assertIsInstance(read_response.json, list)

    def test_read_all_valid(self):
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

        read_response = self.app.get("/materials/read-all", headers=headers)

        self.assertIsInstance(read_response.json, list)

    def test_read_by_parameter_valid(self):
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

        read_response = self.app.get("/materials/read-by-parameter", headers=headers, json = {"category": "Qúimica"})
        self.assertIsInstance(read_response.json, list)

    def test_read_isbn_invalid(self):
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

        read_response = self.app.get(f"/materials/read-by-serial-number/{None}", headers=headers)
        self.assertEqual(read_response.status_code, 404)
        self.assertEqual(read_response.json, {"msg": "Número de série não encontrado."})

        
if __name__ == "__main__":
    unittest.main()