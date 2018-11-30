from flask import Flask
from flaskext.mysql import MySQL
from flask_restful import Api
from flask_cors import CORS


class Database:

    def __init__(self):
        self._app = Flask(__name__)
        self._app.config['MYSQL_DATABASE_HOST'] = 'localhost'
        self._app.config['MYSQL_DATABASE_USER'] = 'iweb'
        self._app.config['MYSQL_DATABASE_PASSWORD'] = 'iweb'
        self._app.config['MYSQL_DATABASE_DB'] = 'iweb'
        mysql = MySQL()
        mysql.init_app(self._app)
        self._api = Api(self._app)
        CORS(self._app)
        self._cursor = mysql.get_db().cursor()

    @property
    def cursor(self):
        return self._cursor

    @property
    def api(self):
        return self._api

    @property
    def app(self):
        return self._app

