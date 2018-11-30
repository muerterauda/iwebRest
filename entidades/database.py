from flask import Flask
from flaskext.mysql import MySQL
from flask_restful import Api
from flask_cors import CORS

app = Flask(__name__)

app.config['MYSQL_DATABASE_HOST'] = 'localhost'
app.config['MYSQL_DATABASE_USER'] = 'iweb'
app.config['MYSQL_DATABASE_PASSWORD'] = 'iweb'
app.config['MYSQL_DATABASE_DB'] = 'iweb'

mysql = MySQL()
mysql.init_app(app)
api = Api(app)
CORS(app)


def get_database_cursor():
    return mysql.get_db().cursor()


def get_api():
    return api
