from hashlib import sha256
from database.base_helper import BaseHelper
from flask_jwt_extended import create_access_token

class AuthHelper(BaseHelper):
    def create(self, name: str, last_name: str, login: str, password: str, role: str) -> bool:

        hashed_password = sha256(password.encode()).hexdigest()

        insert_user_query = "INSERT INTO usuario (Login, Senha, Nome, Sobrenome) VALUES (%s, %s, %s, %s)"

        try:
            self.cursor.execute(insert_user_query, ( login, hashed_password, name, last_name))
            user_id = self.cursor.lastrowid

            select_role_id_query = "SELECT ID_da_Funcao FROM funcao WHERE Funcao = %s"
            self.cursor.execute(select_role_id_query, (role,))
            role_id = self.cursor.fetchone()[0]
            insert_user_role_query = "INSERT INTO usuario_funcao (FK_ID_da_Funcao, FK_ID_do_Usuario) VALUES (%s, %s)"
            self.cursor.execute(insert_user_role_query, (role_id, user_id))
            self.conn.commit()

            return True

        except Exception as err:
            self.conn.rollback()
            print(f"ERROR: {err}")
            return False
        
    def read(self, user_id: int):
        select_user_query = "SELECT * FROM Usuario WHERE ID_do_Usuario = %s"
        try:
            self.cursor.execute(select_user_query, (user_id,))
            user_data = self.cursor.fetchone()
            return user_data
        
        except Exception as err:
            print(f"ERROR: {err}")
            return None
        
    def update(self, user_id: int, new_name: str, new_last_name: str, new_password: str) -> bool:
        fields_to_update = []
        args = []

        if new_name:
            fields_to_update.append("Nome = %s")
            args.append(new_name)

        if new_last_name:
            fields_to_update.append("Sobrenome = %s")
            args.append(new_last_name)

        if new_password:
            hashed_password = sha256(new_password.encode()).hexdigest()
            fields_to_update.append("Senha = %s")
            args.append(hashed_password)

        if not len(fields_to_update):
            print("Informações não fornecidas")
            return False
        
        update_user_query = "UPDATE Usuario SET " + ", ".join(fields_to_update) + "WHERE ID_do_Usuario = %s"
        args.append(user_id)
        
        try:
            self.cursor.execute(update_user_query, (args))
            self.conn.commit()
            return True
        
        except Exception as err:
            self.conn.rollback()
            print(f"ERROR: {err}")
            return False
        
    def delete(self, user_id: int) -> bool:
        delete_user_query = "DELETE FROM Usuario WHERE ID_do_Usuario = %s"
        delete_user_role_query = "DELETE FROM usuario_funcao WHERE FK_ID_do_Usuario = %s"
        try:
            self.cursor.execute(delete_user_query, (user_id, ))
            self.cursor.execute(delete_user_role_query, (user_id, ))
            self.conn.commit()
            return True
        
        except Exception as err:
            self.conn.rollback()
            print(f"ERROR: {err}")
            return False
        
    def check_login(self, login: str, password: str):
        hashed_password = sha256(password.encode()).hexdigest()
        select_user_query = "SELECT * FROM Usuario WHERE Login = %s AND Senha = %s"
        try:
            self.cursor.execute(select_user_query, (login, hashed_password))
            user = self.cursor.fetchone()
            if user:
                user_id = user[4]
                select_user_role_query = "SELECT Funcao FROM funcao JOIN usuario_funcao ON ID_da_Funcao = FK_ID_da_Funcao WHERE FK_ID_do_Usuario = %s"
                try:
                    self.cursor.execute(select_user_role_query, (user_id,))
                    role = self.cursor.fetchone()[0]

                    add_claims = {
                        "role" : role,
                        "name" : user[3]
                    }

                    access_token = create_access_token(identity = user_id, additional_claims = add_claims)
                    return access_token

                except Exception as err:
                    print(f"ERROR: {err}")
                    return False
                
            else:
                return False
            
        except Exception as err:
            print(f"ERROR: {err}")
            return False