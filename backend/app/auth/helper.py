from hashlib import sha256
from database.base_helper import BaseHelper
from flask_jwt_extended import create_access_token
import base64

class AuthHelper(BaseHelper):
    def create(self, name: str, last_name: str, email: str, password: str, role: str, gender: str, profile_img: bytes = None) -> tuple[bool, str]:
        msg = ""
        try:
            login_exists = self.read(email=email)
            if login_exists:
                return False, "Email já registrado."
            
            if name and last_name and email and password and role and gender:
                hashed_password = sha256(password.encode()).hexdigest()

                insert_user_query = "INSERT INTO Usuario (Email, Senha, Nome, Sobrenome, Funcao, Genero, Profile_img) VALUES (%s, %s, %s, %s, %s, %s, %s)"

                try:
                    self.cursor.execute(insert_user_query, ( email, hashed_password, name, last_name, role, gender, profile_img))
                    self.conn.commit()
                    msg = "Conta criada com sucesso!"
                    return True, msg

                except Exception as err:
                    self.conn.rollback()
                    return False, str(err)

            else:
                msg = "Campos incompletos."
                return False, msg
        except Exception as err:
            return False, str(err)

    def read(self, user_id: int = None, name: str = None, email: str = None) -> list | None:
        role_dict = {"admin": "Administrador", "estudante": "Estudante", "professor": "Professor"}
        gender_dict = {"m": "Masculino", "f": "Feminino", "n": "Não informado"}
        if user_id:
            select_user_query = "SELECT * FROM Usuario WHERE Id = %s"
            try:
                self.cursor.execute(select_user_query, (user_id,))
                user_data = list(self.cursor.fetchone())

                user_data[3] = user_data[3].capitalize()
                user_data[4] = user_data[4].capitalize()
                user_data[5] = role_dict[user_data[5]]
                user_data[6] = gender_dict[user_data[6]]

                if user_data[-1]:
                    user_data[-1] = base64.b64encode(user_data[-1]).decode('utf-8')
                return user_data 
            
            except Exception as err:
                print(f"ERROR: {err}")
                return None
        
        elif name:
            select_user_query = "SELECT * FROM Usuario WHERE Nome = %s"
            try:
                self.cursor.execute(select_user_query, (name, ))
                user_data = list(self.cursor.fetchone())

                user_data[3] = user_data[3].capitalize()
                user_data[4] = user_data[4].capitalize()
                user_data[5] = role_dict[user_data[5]]
                user_data[6] = gender_dict[user_data[6]]

                if user_data[-1]:
                    user_data[-1] = base64.b64encode(user_data[-1]).decode('utf-8')
                return user_data 
            
            except Exception as err:
                print(f"ERROR: {err}")
                return None
            
        elif email:
            select_user_query = "SELECT * FROM Usuario WHERE Email = %s"
            try:
                self.cursor.execute(select_user_query, (email, ))
                user_data = list(self.cursor.fetchone())
                
                user_data[3] = user_data[3].capitalize()
                user_data[4] = user_data[4].capitalize()
                user_data[5] = role_dict[user_data[5]]
                user_data[6] = gender_dict[user_data[6]]

                if user_data[-1]:
                    user_data[-1] = base64.b64encode(user_data[-1]).decode('utf-8')
                return user_data 
            
            except Exception as err:
                print(f"ERROR: {err}")
                return None
            
        else:
            print("Informações não fornecidas.")
            return None
        
    def read_all(self) -> list | None:
        select_all_users_query = "SELECT * FROM Usuario"
        try:
            self.cursor.execute(select_all_users_query)
            users_data = list(self.cursor.fetchall())
            for user in users_data:
                user[3] = user[3].capitalize()
                user[4] = user[4].capitalize()
                user[5] = user[5].capitalize()
                if user[6] == "m":
                    user[6] = "Masculino"
                elif user[6] == "f":
                    user[6] = "Feminino"
                else:
                    user[6] = "Não informado"
                if user[-1]:
                    user[-1] = base64.b64encode(user[-1]).decode('utf-8')
            return users_data
        
        except Exception as err:
            print(f"ERROR: {err}")
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
        
    def check_login(self, email: str, password: str) -> tuple[str, str] | tuple[bool, str]:
        msg = ""
        if email and password:
            hashed_password = sha256(password.encode()).hexdigest()
            select_user_query = "SELECT * FROM Usuario WHERE Email = %s AND Senha = %s"
            try:
                self.cursor.execute(select_user_query, (email, hashed_password))
                user = self.cursor.fetchone()
                if user:
                    user_id = user[0]
                    try:
                        role = user[5]
                        name = str(user[3]).capitalize()
                        add_claims = {
                            "role" : role,
                            "email" : email,
                            "name" : name
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

