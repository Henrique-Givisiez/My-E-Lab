import unittest
import sys
import os

# Adiciona o diretório 'app' ao sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), '..','..', 'app'))

# Agora você pode importar o 'factory'
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

        delete_response = self.app.delete("/books/delete/9788580550979", headers=headers)
        self.assertEqual(delete_response.status_code, 200)
        self.assertEqual(delete_response.json, {"msg": "Livro excluído.", "success": True})

    
        
if __name__ == "__main__":
    unittest.main()