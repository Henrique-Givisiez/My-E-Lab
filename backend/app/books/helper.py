from database.base_helper import BaseHelper
from datetime import datetime
class BooksHelper(BaseHelper):
    
    def create(self, ISBN: str, title: str, description: str,  
               category: str, date: str, author: str, location: str, book_cover: bytes = None) -> tuple[bool, str]:
        msg = ""
        if ISBN and title and description and category and date and author and location:
            tipo_item = "livro"
            data_obj = datetime.strptime(date, "%d/%m/%Y")
            data_formatada = data_obj.strftime("%Y-%m-%d")
            insert_book_query = """
            INSERT INTO Livro (ISBN, Titulo, Descricao, Categoria, Data_aquisicao, Autor, Localizacao, Book_cover)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            insert_item_query = "INSERT INTO Item (Id, Tipo_item) VALUES (%s, %s)"
            try:
                self.cursor.execute(insert_item_query, (ISBN, tipo_item))
                self.cursor.execute(insert_book_query, (ISBN, title, description, category, data_formatada, author, location, book_cover))
                self.conn.commit()
                msg = "Livro cadastrado com sucesso!"
                return True, msg

            except Exception as err:
                print(f"ERROR: {err}")
                return False, err
        else:
            msg = "Campos incompletos."
            return False, msg
        
    def read(self, ISBN: str) -> list | None:
        select_book_query = "SELECT * FROM Livro WHERE ISBN = %s"
        try:
            self.cursor.execute(select_book_query, (ISBN, ))
            book_data = list(self.cursor.fetchone())
            book_data[-1] = book_data[-1].decode('utf-8')
            return book_data
        
        except Exception as err:
            print(f"ERROR: {err}")
            return None


    def read_all_books(self) -> list | None:
        select_all_books_query = "SELECT * FROM Livro"
        try:
            self.cursor.execute(select_all_books_query, ())
            all_books = list(map(list, self.cursor.fetchall()))
            for ind, uri in enumerate(all_books):
                all_books[ind][-1] = uri[-1].decode('utf-8')

            return all_books
        
        except Exception as err:
            print(f"ERROR: {err}")
            return None
        

    def read_book_by_parameter(self, title: str = None, author: str = None, ISBN: str = None, 
                               category: str = None, location: str = None, date: str = None) -> list | None:
        select_books_query = "SELECT * FROM Livro WHERE "
        args = []

        if title:
            select_books_query += "Titulo = %s AND "
            args.append(title)

        if author:
            select_books_query += "Autor = %s AND "
            args.append(author)

        if ISBN:
            select_books_query += "ISBN = %s AND "
            args.append(ISBN)

        if category:
            select_books_query += "Categoria = %s AND "
            args.append(category)

        if location:
            select_books_query += "Localizacao = %s AND "
            args.append(location)

        if date:
            select_books_query += "Data_aquisicao = %s AND "
            args.append(date)

        select_books_query = select_books_query[:-5]

        try:
            self.cursor.execute(select_books_query, tuple(args))
            books = list(map(list, self.cursor.fetchall()))
            for ind, uri in enumerate(books):
                books[ind][-1] = uri[-1].decode('utf-8')
                
            return books
        
        except Exception as err:
            print(f"ERROR: {err}")
            return None
        
        
    def update(self, ISBN: str, new_title: str = None, new_description: str = None, new_category: str = None,
               new_date: str = None, new_author: str = None, new_location: str = None, new_URI: str = None) -> tuple[bool, str]:

        book_exists = self.read(ISBN=ISBN)
        if book_exists:
            update_book_query = "UPDATE Livro SET "
            args = []

            if new_title:
                update_book_query += "Titulo = %s, "
                args.append(new_title)

            if new_description:
                update_book_query += "Descricao = %s, "
                args.append(new_description)

            if new_category:
                update_book_query += "Categoria = %s, "
                args.append(new_category)

            if new_date:
                update_book_query += "Data_aquisicao = %s, "
                args.append(new_date)

            if new_author:
                update_book_query += "Autor = %s, "
                args.append(new_author)
            
            if new_location:
                update_book_query += "Localizacao = %s, "
                args.append(new_location)

            if new_URI:
                update_book_query += "URI = %s, "
                args.append(new_URI)

            update_book_query = update_book_query[:-2]
            update_book_query += " WHERE ISBN = %s"
            args.append(ISBN)
            
            try:
                self.cursor.execute(update_book_query, tuple(args))
                self.conn.commit()
                msg = "Livro atualizado com sucesso!"
                return True, msg
            
            except Exception as err:
                self.conn.rollback()
                print(f"ERROR: {err}")
                return False, err
        
        else:
            msg = "ISBN não encontrado."
            return False, msg
    
    def delete(self, ISBN: str) -> tuple[bool, str]:
        delete_book_query = "DELETE FROM Livro WHERE ISBN = %s"
        delete_item_query = "DELETE FROM Item WHERE Id = %s"
        msg = ""
        book_exists = self.read(ISBN=ISBN)
        if book_exists:
            try:
                book_is_loaned = self.book_is_loaned(ISBN=ISBN)
                if book_is_loaned:
                    msg = "Livro está emprestado no momento. Não foi possível excluir."
                    return False, msg

                self.cursor.execute(delete_book_query, (ISBN,))        
                self.cursor.execute(delete_item_query, (ISBN,))
                self.conn.commit()
                msg = "Livro excluído."
                return True, msg


            except Exception as err:
                print(f"ERROR: {err}")
                return False, err
            
        else:
            msg = "Livro não encontrado. Verifique o ISBN"        
            return False, msg
        

    def book_is_loaned(self, ISBN: str) -> bool:
        select_loan_query = "SELECT * FROM Emprestimo WHERE Status_atual = %s AND FK_id_item = %s"
        try:
            self.cursor.execute(select_loan_query, ("emprestado", ISBN,))
            result = self.cursor.fetchall()
            if result:
                return True
            
            return False
        
        except Exception as err:
            print(f"ERROR: {err}")
            return True
        