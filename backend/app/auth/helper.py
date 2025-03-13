# Importa bibliotecas necessárias
from hashlib import sha256
from database.base_helper import BaseHelper
from flask_jwt_extended import create_access_token
from datetime import timedelta
import base64

# Helper para fazer a interação com o banco de dados 
class AuthHelper(BaseHelper):
    # Método que irá inserir um novo cadastro no banco de dados na tabela "Usuarios"
    def create(self, name: str, last_name: str, email: str, password: str, role: str, gender: str, profile_img: bytes = None) -> tuple[bool, str]:
        msg = ""
        try:
            # Verifica se a conta já está cadastrada com o email fornecido
            login_exists = self.read(email=email)
            if login_exists:
                return False, "Email já registrado."
            
            # Verifica a existência das informações obrigatórias
            if name and last_name and email and password and role and gender:
                # Criptografa a senha 
                hashed_password = sha256(password.encode()).hexdigest()

                # Comando SQL para inserir informações no banco de dados
                insert_user_query = """
                                    INSERT INTO 
                                        Usuario (Email, Senha, Nome, Sobrenome, Funcao, Genero, Profile_img)
                                        VALUES (%s, %s, %s, %s, %s, %s, %s)
                                    """

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

    # Método que irá ler um usuário no banco de dados com base na coluna Id (identificador do usuário)
    def read(self, user_id: int = None, email: str = None) -> list | None:

        # Dicionários auxiliares para mapear os valores retornados no banco de dados
        role_dict = {"admin": "Administrador", "estudante": "Estudante", "professor": "Professor"}
        gender_dict = {"m": "Masculino", "f": "Feminino", "n": "Não informado"}

        if email:
            # Comando SQL para ler usuário da tabela "Usuario" com base na coluna "Email"
            select_user_query = "SELECT * FROM Usuario WHERE Email = %s"

            try:
                self.cursor.execute(select_user_query, (email,))
                user_data = list(self.cursor.fetchone())
                return user_data if user_data else None
            except Exception as err:
                print(f"ERROR: {err}")
                return None
            
        # Verifica a existência do Id
        if user_id:
            # Comando SQL para ler usuário da tabela "Usuario" com base na coluna "Id"
            select_user_query = "SELECT * FROM Usuario WHERE Id = %s"

            try:
                self.cursor.execute(select_user_query, (user_id,))
                user_data = list(self.cursor.fetchone())

                # Formata os dados retornados
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
        
    # Método que lê todos os usuários do banco de dados
    def read_all(self) -> list | None:
        # Comando SQL para ler todos os usuários da tabela "Usuario"
        select_all_users_query = "SELECT * FROM Usuario"
        try:
            self.cursor.execute(select_all_users_query)
            users_data = list(self.cursor.fetchall())
            users_data = [list(user) for user in users_data]

            # Formata dados retornados
            for user in users_data:
                user[3] = user[3].capitalize()
                user[4] = user[4].capitalize()
                user[5] = user[5].capitalize()
                if user[5].startswith("A"):
                    user[5] = "Administrador"
                if user[6] == "m":
                    user[6] = "Masculino"
                elif user[6] == "f":
                    user[6] = "Feminino"
                else:
                    user[6] = "Não informado"
                if user[-1]:
                    user[-1] = base64.b64encode(user[-1]).decode('utf-8')

            # Ordena os usuários por nome
            users_data.sort(key=lambda x: x[3])

            # Mapeia os valores retornados
            for ind in range(len(users_data)):
                users_data[ind] = {
                    "Email": users_data[ind][1],
                    "Nome_Sobrenome": users_data[ind][3] + " " + users_data[ind][4],
                    "Funcao": users_data[ind][5],
                    "Genero": users_data[ind][6],
                    "Imagem_perfil": users_data[ind][-1]
                }
            return users_data
        
        except Exception as err:
            print(f"ERROR: {err}")
            return None
         
    # Método que atualiza informações de um usuário no banco de dados
    def update(self, user_id: int, new_name: str = None, new_last_name: str = None, new_password: str = None, 
               new_profile_img: bytes = None, new_gender: str = None, new_role: str = None, new_email: str = None) -> tuple[bool, str]:
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
            fields_to_update.append("PROFILE_IMG = %s")
            args.append(new_profile_img)
        
        if new_gender:
            fields_to_update.append("Genero = %s")
            args.append(new_gender)
        
        if new_role:
            fields_to_update.append('Funcao = %s')
            args.append(new_role)

        if new_email:
            fields_to_update.append('Email = %s')
            args.append(new_email)
            
        if not len(fields_to_update):
            msg = "Informações não fornecidas."
            return False, msg
        
        # Comando SQL para atualizar informações do usuário na tabela "Usuario"
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
    
    # Método para deletar usuário no banco de dados
    def delete(self, user_id: int) -> tuple[bool, str]:
        msg = ""

        # Comando SQL para deletar usuário da tabela "Usuario"
        delete_user_query = "DELETE FROM Usuario WHERE Id = %s"

        # Verifica se o Id foi fornecido
        if user_id:
            try:
                user_exists = self.read(user_id=user_id)
                # Verifica se o usuário existe no banco de dados
                if user_exists:
                    user_have_loans = self.user_have_loans(user_id=user_id)
                    # Verifica se o usuário possui empréstimos ativos
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
        
    # Método para verificar login
    def check_login(self, email: str, password: str) -> tuple[str, str] | tuple[bool, str]:
        msg = ""

        # Verifica se o email e a senha foram fornecidos
        if email and password:
            # Criptografa a senha
            hashed_password = sha256(password.encode()).hexdigest()
            # Comando SQL para selecionar usuário da tabela "Usuario" com base no email e senha fornecidos
            select_user_query = "SELECT * FROM Usuario WHERE Email = %s AND Senha = %s"
            try:
                self.cursor.execute(select_user_query, (email, hashed_password))
                user = self.cursor.fetchone()
                # Se as senhas e emails coincidirem, retorna o token de acesso
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

                        # Tempo de validade do token
                        expires = timedelta(minutes=30)

                        # Token JWT de autenticação
                        access_token = create_access_token(identity = str(user_id), additional_claims = add_claims, expires_delta=expires)
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
        
    # Método para verificar se o usuário tem empréstimos ativos
    def user_have_loans(self, user_id: int) -> bool:
        # Comando SQL para selecionar empréstimos do usuário
        select_loans_query = "SELECT * FROM Emprestimo WHERE FK_id_usuario = %s"
        try:
            self.cursor.execute(select_loans_query, (user_id, ))
            result = self.cursor.fetchall()
            # Se o usuário tiver empréstimos ativos, retorna True
            if result:
                return True
                
            return False
        
        except Exception as err:
            print(f"ERROR: {err}")
            return True
        
    # Método para verificar se a senha fornecida coincide com a senha do usuário
    def confirm_password(self, user_id: int, password: str) -> bool:
        # Comando SQL para selecionar senha do usuário
        select_user_query = "SELECT Senha FROM Usuario WHERE Id = %s"
        try:
            self.cursor.execute(select_user_query, (user_id, ))
            user_password = self.cursor.fetchone()[0]
            hashed_password = sha256(password.encode()).hexdigest()
            # Se as senhas coincidem, retorna True
            if user_password == hashed_password:
                return True
            
            return False
        
        except Exception as err:
            print(f"ERROR: {err}")
            return False

