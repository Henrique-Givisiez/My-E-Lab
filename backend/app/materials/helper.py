from database.base_helper import BaseHelper
from datetime import datetime
class MaterialsHelper(BaseHelper):
    
    def create(self, serial_number: str, name: str, description: str,  
               category: str, date: str, location: str, material_img: bytes = None) -> tuple[bool, str]:
        msg = ""
        if serial_number and name and description and category and date and location:
            tipo_item = "material"
            data_obj = datetime.strptime(date, "%d/%m/%Y")
            data_formatada = data_obj.strftime("%Y-%m-%d")
            insert_material_query = """
            INSERT INTO Material_didatico (Numero_serie, Nome, Descricao, Categoria, Data_aquisicao, Localizacao, URI)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            insert_item_query = "INSERT INTO Item (Id, Tipo_item) VALUES (%s, %s)"
            try:
                self.cursor.execute(insert_item_query, (serial_number, tipo_item))
                self.cursor.execute(insert_material_query, (serial_number, name, description, category, data_formatada, location, material_img))
                self.conn.commit()
                msg = "Material cadastrado com sucesso!"
                return True, msg

            except Exception as err:
                print(f"ERROR: {err}")
                return False, err
        else:
            msg = "Campos incompletos."
            return False, msg
        
    def read(self, serial_number: str) -> list | None:
        select_material_query = "SELECT * FROM Material_didatico WHERE numero_serie = %s"
        try:
            self.cursor.execute(select_material_query, (serial_number, ))
            book_data = list(self.cursor.fetchone())
            book_data[-1] = book_data[-1].decode('utf-8')
            return book_data
        
        except Exception as err:
            print(f"ERROR: {err}")
            return None


    def read_all_materials(self) -> list | None:
        select_all_materials_query = "SELECT * FROM Material_didatico"
        try:
            self.cursor.execute(select_all_materials_query, ())
            all_materials = list(map(list, self.cursor.fetchall()))
            for ind, uri in enumerate(all_materials):
                all_materials[ind][-1] = uri[-1].decode('utf-8')

            return all_materials
        
        except Exception as err:
            print(f"ERROR: {err}")
            return None
        

    def read_material_by_parameter(self, name: str = None, serial_number: str = None, 
                               category: str = None, location: str = None, date: str = None) -> list | None:
        select_materials_query = "SELECT * FROM Material_didatico WHERE "
        args = []

        if name:
            select_materials_query += "Titulo = %s AND "

        if serial_number:
            select_materials_query += "ISBN = %s AND "
            args.append(serial_number)

        if category:
            select_materials_query += "Categoria = %s AND "
            args.append(category)

        if location:
            select_materials_query += "Localizacao = %s AND "
            args.append(location)

        if date:
            select_materials_query += "Data_aquisicao = %s AND "
            args.append(date)

        select_materials_query = select_materials_query[:-5]

        try:
            self.cursor.execute(select_materials_query, tuple(args))
            materials = list(map(list, self.cursor.fetchall()))
            for ind, uri in enumerate(materials):
                materials[ind][-1] = uri[-1].decode('utf-8')
                
            return materials
        
        except Exception as err:
            print(f"ERROR: {err}")
            return None
        
        
    def update(self, serial_number: str, new_name: str = None, new_description: str = None, new_category: str = None,
               new_date: str = None, new_location: str = None, new_URI: str = None) -> tuple[bool, str]:

        material_exists = self.read(serial_number=serial_number)
        if material_exists:
            update_material_query = "UPDATE Material_didatico SET "
            args = []

            if new_name:
                update_material_query += "Titulo = %s, "
                args.append(new_name)

            if new_description:
                update_material_query += "Descricao = %s, "
                args.append(new_description)

            if new_category:
                update_material_query += "Categoria = %s, "
                args.append(new_category)

            if new_date:
                update_material_query += "Data_aquisicao = %s, "
                args.append(new_date)

            if new_location:
                update_material_query += "Localizacao = %s, "
                args.append(new_location)

            if new_URI:
                update_material_query += "URI = %s, "
                args.append(new_URI)

            update_material_query = update_material_query[:-2]
            update_material_query += " WHERE Numero_serie = %s"
            args.append(serial_number)
            
            try:
                self.cursor.execute(update_material_query, tuple(args))
                self.conn.commit()
                msg = "Material atualizado com sucesso!"
                return True, msg
            
            except Exception as err:
                self.conn.rollback()
                print(f"ERROR: {err}")
                return False, err
        
        else:
            msg = "Numero de série não encontrado."
            return False, msg
    
    def delete(self, serial_number: str) -> tuple[bool, str]:
        delete_material_query = "DELETE FROM Material_didatico WHERE Numero_serie = %s"
        delete_item_query = "DELETE FROM Item WHERE Id = %s"
        msg = ""
        material_exists = self.read(serial_number=serial_number)
        if material_exists:
            try:
                material_is_loaned = self.material_is_loaned(serial_number=serial_number)
                if material_is_loaned:
                    msg = "Material está emprestado no momento. Não foi possível excluir."
                    return False, msg

                self.cursor.execute(delete_material_query, (serial_number,))        
                self.cursor.execute(delete_item_query, (serial_number,))
                self.conn.commit()
                msg = "Material excluído."
                return True, msg


            except Exception as err:
                print(f"ERROR: {err}")
                return False, err
            
        else:
            msg = "Material não encontrado. Verifique o número de série"        
            return False, msg
        

    def material_is_loaned(self, serial_number: str) -> bool:
        select_loan_query = "SELECT * FROM Emprestimo WHERE Status_atual = %s AND FK_id_item = %s"
        try:
            self.cursor.execute(select_loan_query, ("emprestado", serial_number,))
            result = self.cursor.fetchall()
            if result:
                return True
            
            return False
        
        except Exception as err:
            print(f"ERROR: {err}")
            return True
        