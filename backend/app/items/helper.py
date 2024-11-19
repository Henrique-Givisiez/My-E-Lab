from database.base_helper import BaseHelper
from factory import database

class ItemsHelper(BaseHelper):
    
    def create(self, item_id: int, item_type) -> tuple[bool, str]:
        if item_id and item_type:
            insert_item_query = """INSERT INTO Item (Id, Tipo_item) VALUES(%s, %s)"""
            try:
                self.cursor.execute(insert_item_query, (item_id, item_type))
                self.conn.commit()

                item_created = self.read_item(item_id)


                if item_created:
                    msg = "Item cadastrado com sucesso!"
                    return True, msg

                msg = "Falha ao cadastrar item. Tente novamente."    
                return False, msg
            
            except Exception as err:
                self.conn.rollback()
                print(f"ERROR: {err}")
                return False, err
            
        else:
            msg = f"Item ID: {item_id}\n Tipo item{item_type}"
            return False, msg
        
    
    def read_item(self, item_id: int) -> list | None:
        select_item_query = """SELECT * FROM Livro WHERE ISBN = %s
                               UNION
                               SELECT * FROM Material_didatico WHERE Numero_serie = %s
                            """
        try:
            self.cursor.execute(select_item_query, (item_id, item_id))
            item_data = list(self.cursor.fetchone())
            return item_data
        
        except Exception as err:
            print(f"ERROR: {err}")
            return None
        
    def read_all_items(self) -> list | None:
        select_items_query = """SELECT 
                                    l.ISBN, l.Titulo,l.Categoria, l.Autor, l.BOOK_COVER, i.Tipo_item
                                FROM item i INNER JOIN livro l ON i.Id = l.ISBN
                                UNION
                                SELECT
                                    m.Numero_serie, m.Nome, m.Categoria, i.Tipo_item
                                FROM item i INNER JOIN material_didatico m ON i.Id = m.Numero_serie
                            """
        try:
            self.cursor.execute(select_items_query)
            all_items_data = list(self.cursor.fetchall())
            return all_items_data
        except Exception as err:
            print(f"ERROR: {err}")
            return None