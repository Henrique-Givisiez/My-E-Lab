from database.base_helper import BaseHelper

class BooksHelper(BaseHelper):
    
    def create(self, ISBN: str, title: str, description: str,  
               category: str, date: str, author: str, location: str, book_cover: bytes = None) -> tuple[bool, str]:
        msg = ""
        if ISBN and title and description and category and date and author and location:
            insert_book_query = """
            INSERT INTO Livro (ISBN, Titulo, Descricao, Categoria, Data_aquisicao, Autor, Localizacao, URI)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            insert_item_query = "INSERT INTO Item (Id, Tipo_item) VALUES (livro)"
            try:
                self.cursor.execute(insert_book_query, (ISBN, title, description, category, date, author, location, book_cover))
                self.cursor.execute(insert_item_query, ())
                self.conn.commit()
                msg = "Livro cadastrado com sucesso!"
                return True, msg

            except Exception as err:
                print(f"ERROR: {err}")
                return False, msg
        else:
            msg = "Campos incompletos."
            return False, msg
        