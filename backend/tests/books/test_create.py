import unittest
import sys
import os
from time import sleep

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
        create_book_response = self.app.post("/books/create", json = {"ISBN": "9788580550979", "title": "Princípios da Economia",
                                                          "description": """Autores e pesquisadores respeitados, Bob Frank e
                                                            Ben Bernanke mostram neste livro que o estudo mais aprofundado 
                                                            de princípios básicos é o caminho para o sucesso pedagógico 
                                                            também na introdução à economia. Ao evitar o apelo excessivo 
                                                            às derivações matemáticas formais, os autores apresentam os
                                                            conceitos de forma intuitiva com exemplos de contextos conhecidos.""",
                                                            "category": "Economia", "date": "07/08/2024", "author": "Robert Frank",
                                                            "location": "sala 1 corredor 3", "book_cover": "https://m.media-amazon.com/images/I/9142TJkXHZL._SL1500_.jpg"},
                                                            headers=headers)
        self.assertEqual(create_book_response.status_code, 201)
        self.assertEqual(create_book_response.json, {"msg": "Livro cadastrado com sucesso!", "success": True})

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

        create_book_response = self.app.post("/books/create", json = {}, headers = headers)
        self.assertEqual(create_book_response.status_code, 400)        
        self.assertEqual(create_book_response.json, {"success": False, "msg": "Campos incompletos."})

    def test_create_invalid_role(self):
        response = self.app.post("/auth/signup", json={"name": "Beltrano", "last_name":  "Andrade", "login": "beltrano123", "password": "senha", "role": "estudante", "gender": "m", "profile_img": ""})
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.json['success'])
        sleep(2)
        
        login_response = self.app.post("/auth/login", json = {
            "login": "beltrano123", 
            "password": "senha"
        })
        
        self.assertEqual(login_response.status_code, 200)
        self.assertIn('access_token', login_response.json)

        token = login_response.json['access_token']
        headers = {
            "Authorization": f'Bearer {token}'
        }

        create_book_response = self.app.post("/books/create", json = {"ISBN": "9788580550979", "title": "Princípios da Economia",
                                                          "description": """Autores e pesquisadores respeitados, Bob Frank e
                                                            Ben Bernanke mostram neste livro que o estudo mais aprofundado 
                                                            de princípios básicos é o caminho para o sucesso pedagógico 
                                                            também na introdução à economia. Ao evitar o apelo excessivo 
                                                            às derivações matemáticas formais, os autores apresentam os
                                                            conceitos de forma intuitiva com exemplos de contextos conhecidos.""",
                                                            "category": "Economia", "date": "07/08/2024", "author": "Robert Frank",
                                                            "location": "sala 1 corredor 3", "book_cover": "https://m.media-amazon.com/images/I/9142TJkXHZL._SL1500_.jpg"},
                                                            headers=headers)       
        self.assertEqual(create_book_response.status_code, 403)        
        self.assertEqual(create_book_response.json, {"success": False, "msg": "Usuário não tem permissão para realizar essa operação"})        
        
if __name__ == "__main__":
    unittest.main()