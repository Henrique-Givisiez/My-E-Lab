import pymysql

from auth.helper import AuthHelper
from books.helper import BooksHelper
from loans.helper import LoansHelper
from materials.helper import MaterialsHelper
from items.helper import ItemsHelper

def get_db_connection():
    connection = pymysql.connect(
        host='localhost',
        database='my_e_lab_database',
        user='root',
        password='mypassword'
    )
    return connection


class Database:
    def __init__(self):
        self.connection = get_db_connection()
        self.cursor = self.connection.cursor()
        self.auth = AuthHelper(self.connection, self.cursor)
        self.books = BooksHelper(self.connection, self.cursor)
        self.loans = LoansHelper(self.connection, self.cursor)
        self.materials = MaterialsHelper(self.connection, self.cursor)
        self.items = ItemsHelper(self.connection, self.cursor)

    def close(self):
        self.connection.close()
        self.cursor.close()
