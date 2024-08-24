from hashlib import sha256
from database.base_helper import BaseHelper
from flask_jwt_extended import create_access_token

class AuthHelper(BaseHelper):
    def create(self, name: str, last_name: str, login: str, password: str, role: str, gender: str, profile_img: bytes = None) -> tuple[bool, str]:
        msg = ""
        try:
            if name and last_name and login and password and role and gender:
                hashed_password = sha256(password.encode()).hexdigest()

                insert_user_query = "INSERT INTO Usuario (Login, Senha, Nome, Sobrenome, Funcao, Genero, Profile_img) VALUES (%s, %s, %s, %s, %s, %s, %s)"

                try:
                    self.cursor.execute(insert_user_query, ( login, hashed_password, name, last_name, role, gender, profile_img))
                    self.conn.commit()
                    msg = "Conta criada com sucesso!"
                    return True, msg

                except Exception as err:
                    self.conn.rollback()
                    print(f"ERROR: {err}")
                    return False, err

            else:
                msg = "Campos incompletos."
                return False, msg
        except Exception as err:
            print(err)
    def read(self, user_id: int = None, login: str = None) -> list | None:
        if user_id:
            select_user_query = "SELECT * FROM Usuario WHERE Id = %s"
            try:
                self.cursor.execute(select_user_query, (user_id,))
                user_data = list(self.cursor.fetchone())
                user_data[-1] = user_data[-1].decode('utf-8')
                return user_data 
            
            except Exception as err:
                print(f"ERROR: {err}")
                return None
        
        elif login:
            select_user_query = "SELECT * FROM Usuario WHERE Login = %s"
            try:
                self.cursor.execute(select_user_query, (login, ))
                user_data = list(self.cursor.fetchone())
                user_data[-1] = user_data[-1].decode('utf-8')
                return user_data 
            
            except Exception as err:
                print(f"ERROR: {err}")
                return None
            
        else:
            print("Informações não fornecidas.")
            return None
        
    def update(self, user_id: int, new_name: str, new_last_name: str, new_password: str, new_profile_img: bytes, new_gender: str) -> tuple[bool, str]:
        fields_to_update = []
        args = []
        msg = ""
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
        
        if new_profile_img:
            fields_to_update.append("URI = %s")
            args.append(new_profile_img)
        
        if new_gender:
            fields_to_update.append("Gender = %s")
            args.append(new_gender)
            
        if not len(fields_to_update):
            msg = "Informações não fornecidas."
            return False, msg
        
        update_user_query = "UPDATE Usuario SET " + ", ".join(fields_to_update) + "WHERE Id = %s"
        args.append(user_id)
        
        try:
            self.cursor.execute(update_user_query, (args))
            self.conn.commit()
            msg = "Usuário atualizado com sucesso."
            return True, msg
        
        except Exception as err:
            self.conn.rollback()
            print(f"ERROR: {err}")
            return False, err
        
    def delete(self, user_id: int) -> tuple[bool, str]:
        msg = ""
        delete_user_query = "DELETE FROM Usuario WHERE Id = %s"
        if user_id:
            try:
                user_exists = self.read(user_id=user_id)
                if user_exists:
                    user_have_loans = self.user_have_loans(user_id=user_id)
                    if user_have_loans:
                        msg = "Usuário tem empréstimos ativos."
                        return False, msg
                    
                    self.cursor.execute(delete_user_query, (user_id, ))
                    self.conn.commit()
                    msg = "Usuário excluído."
                    return True, msg
                
                msg = "Usuário inexistente."
                return False, msg
        
            except Exception as err:
                self.conn.rollback()
                print(f"ERROR: {err}")
                return False, err

        else:
            msg = "Usuário inexistente."
            return False, msg
        
    def check_login(self, login: str, password: str) -> tuple[str, str] | tuple[bool, str]:
        msg = ""
        if login and password:
            hashed_password = sha256(password.encode()).hexdigest()
            select_user_query = "SELECT * FROM Usuario WHERE Login = %s AND Senha = %s"
            try:
                self.cursor.execute(select_user_query, (login, hashed_password))
                user = self.cursor.fetchone()
                if user:
                    user_id = user[0]
                    try:
                        role = user[5]
                        name = user[3]
                        add_claims = {
                            "role" : role,
                            "login" : login,
                        }

                        access_token = create_access_token(identity = user_id, additional_claims = add_claims)
                        msg = f"Bem-vindo(a), {name}!"
                        return access_token, msg

                    except Exception as err:
                        print(f"ERROR: {err}")
                        return False, err
                    
                else:
                    msg = "Credenciais inválidas."
                    return False, msg
            
            except Exception as err:
                print(f"ERROR: {err}")
                return False, err

        else:
            msg = "Campos incompletos."
            return False, msg
        
    def user_have_loans(self, user_id: int) -> bool:
        select_loans_query = "SELECT * FROM Emprestimo WHERE FK_id_usuario = %s"
        try:
            self.cursor.execute(select_loans_query, (user_id, ))
            result = self.cursor.fetchall()
            if result:
                return True
                
            return False
        
        except Exception as err:
            print(f"ERROR: {err}")
            return True

