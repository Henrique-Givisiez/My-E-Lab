import pymysql
import pymysql.cursors

# Helper parente que irá fornecera a conexão e o cursor com o banco de dados
class BaseHelper:
    def __init__(self, connection: pymysql.connections.Connection , cursor: pymysql.cursors.Cursor):
        self.conn = connection
        self.cursor = cursor

