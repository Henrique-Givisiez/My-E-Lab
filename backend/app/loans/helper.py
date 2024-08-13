from database.base_helper import BaseHelper
from datetime import timedelta, date, datetime
class LoansHelper(BaseHelper):
    
    def create(self, item_id: str, user_id: int) -> tuple[bool, str]:
        if item_id and user_id:
            today_date = date.today()
            devolution_date = today_date + timedelta(days=14)
            status = "emprestado"

            insert_loan_query = """INSERT INTO Emprestimo (FK_id_item, Data_Emprestimo, Data_Devolucao, Status_atual, FK_id_usuario)
                                   VALUES(%s, %s, %s, %s, %s) 
                                """
            try:
                self.cursor.execute(insert_loan_query, (item_id, today_date, devolution_date, status, user_id))
                self.conn.commit()

                loan_id = self.cursor.lastrowid
                loan_created = self.read_loan(loan_id)

                if loan_created:
                    msg = "Empréstimo bem-sucedido!"
                    return True, msg

                msg = "Falha no empréstimo. Tente novamente."    
                return False, msg
            
            except Exception as err:
                self.conn.rollback()
                print(f"ERROR: {err}")
                return False, err
            
        else:
            msg = "Informações faltando."
            return False, msg
        
    
    def read_loan(self, loan_id: int) -> list | None:
        select_loan_query = "SELECT * FROM Emprestimo WHERE FK_id_item = %s"
        try:
            self.cursor.execute(select_loan_query, (loan_id))
            loan_data = list(self.cursor.fetchone())
            return loan_data
        
        except Exception as err:
            print(f"ERROR: {err}")
            return None
        

    def read_user_loans(self, user_id: int) -> list | None:
        select_loan_query = "SELECT * FROM Emprestimo WHERE FK_id_usuario = %s"
        try:
            self.cursor.execute(select_loan_query, (user_id))
            user_loans = list(self.cursor.fetchall())
            return user_loans
        
        except Exception as err:
            print(f"ERROR: {err}")
            return None
        

    def update(self, loan_id: int, new_date_return: str = None, new_status: str = None) -> tuple[bool, str]:
        update_loan_query = "UPDATE Emprestimo SET "
        args = []

        if new_date_return:
            update_loan_query += "Data_Devolucao = %s, "
            date_obj = datetime.strptime(new_date_return, "%d/%m/%Y")
            date_fmt = date_obj.strftime("%Y-%m-%d")
            args.append(date_fmt)

        if new_status:
            update_loan_query += "Status_atual = %s, "
            args.append(new_status)
        
        update_loan_query = update_loan_query[:-2]
        update_loan_query += " WHERE Id_emprestimo = %s"
        args.append(loan_id)

        try:
            self.cursor.execute(update_loan_query, (args))
            self.conn.commit()
            msg = "Empréstimo atualizado com sucesso!"
            return True, msg
        
        except Exception as err:
            self.conn.rollback()
            print(f"ERROR:{err}")
            return False, err
        

    def delete(self, loan_id: int) -> tuple[bool, str]:
        select_status_loan_query = "SELECT Status_atual FROM Emprestimo WHERE Id_emprestimo = %s"
        try:
            self.cursor.execute(select_status_loan_query, (loan_id))
            loan_status = self.cursor.fetchone()[0]
            if loan_status == "emprestado":
                msg = "Empréstimo do item em andamento. Não foi possível excluir."
                return False, msg

            else:
                try:
                    delete_loan_query = "DELETE FROM Emprestimo WHERE Id_emprestimo = %s"
                    self.cursor.execute(delete_loan_query, (loan_id))
                    self.conn.commit()
                    loan_exists = self.read_loan(loan_id)
                    
                    if loan_exists:
                        msg = "Não foi possível excluir o empréstimo. Tente novamente."
                        return False, msg
                    
                    msg = "Empréstimo excluído."
                    return True, msg
                
                except Exception as err:
                    print(f'ERROR: {err}')
                    return False, err

        
        except Exception as err:
            print(f"ERROR: {err}")
            return False, err
        
    def check_status(self, loan_id: int) -> str | None:
        try:
            status = ''
            today_date = date.today()

            loan_data = datetime.strptime(self.read_loan(loan_id), '%Y-%m-%d')
            date_return = loan_data[3]

            if today_date > date_return:
                status = 'atrasado'

            else:
                status = 'emprestado'

            self.update(loan_id=loan_id, new_status=status)
            return status

        except Exception as err:
            print(f'ERROR: {err}')
            return 
        
