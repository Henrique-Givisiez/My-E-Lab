import pymysql

from backend.app.auth.helper import AuthHelper
# from database.books import BooksHelper
# from database.loans import LoansHelper
# from database.materials import MaterialsHelper


def get_db_connection():
    connection = pymysql.connect(
        host='localhost',
        database='bd2023',
        user='root',
        password='mypassword'
    )
    return connection


class Database:
    def __init__(self):
        self.connection = get_db_connection()
        self.cursor = self.connection.cursor()
        self.auth = AuthHelper(self.connection, self.cursor)
        # self.books = BooksHelper(self.connection, self.cursor)
        # self.loans = LoansHelper(self.connection, self.cursor)
        # self.materials = MaterialsHelper(self.connection, self.cursor)

    def close(self):
        self.connection.close()
        self.cursor.close()
