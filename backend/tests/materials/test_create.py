import unittest
import sys
import os
from time import sleep

sys.path.append(os.path.join(os.path.dirname(__file__), '..','..', 'app'))

from app.factory import create_app
app = create_app()

class TestCreateBook(unittest.TestCase):

    def setUp(self):
        app.config["TESTING"] = True
        self.app = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()
        self.secret_key = "secret_key"

    def tearDown(self) -> None:
        self.app_context.pop()
                        
    def test_create_valid(self):
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
        create_material_response = self.app.post("/materials/create", json = {"serial_number": "1452789630", "name": "Microscópio eletrônico",
                                                            "description": "Material utilizado para visualizar elementos microscópicos.",
                                                            "category": "Qúimica", "date": "12/08/2024", "location": "laboratorio 1 armario 2",
                                                            "material_img": "https://www.prolab.com.br/wp-content/uploads/2014/04/272712693_823.jpg"},
                                                            headers=headers)
        self.assertEqual(create_material_response.status_code, 201)
        self.assertEqual(create_material_response.json, {"msg": "Material cadastrado com sucesso!", "success": True})

    def test_create_invalid(self):
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

        create_material_response = self.app.post("/materials/create", json = {}, headers = headers)
        self.assertEqual(create_material_response.status_code, 400)        
        self.assertEqual(create_material_response.json, {"success": False, "msg": "Campos incompletos."})

    def test_create_invalid_role(self):
        
        login_response = self.app.post("/auth/login", json = {
            "login": "ciclano123", 
            "password": "senha"
        })
        
        self.assertEqual(login_response.status_code, 200)
        self.assertIn('access_token', login_response.json)

        token = login_response.json['access_token']
        headers = {
            "Authorization": f'Bearer {token}'
        }

        create_material_response = self.app.post("/materials/create", json = {"serial_number": "1452789630", "name": "Microscópio eletrônico",
                                                            "description": "Material utilizado para visualizar elementos microscópicos.",
                                                            "category": "Qúimica", "date": "12/08/2024", "location": "laboratorio 1 armario 2", 
                                                            "material_img": "https://www.prolab.com.br/wp-content/uploads/2014/04/272712693_823.jpg"},
                                                            headers=headers)       
        self.assertEqual(create_material_response.status_code, 403)        
        self.assertEqual(create_material_response.json, {"success": False, "msg": "Usuário não tem permissão para realizar essa operação"})        
        
if __name__ == "__main__":
    unittest.main()