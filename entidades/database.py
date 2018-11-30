from flask import Flask
from flaskext.mysql import MySQL
from flask_restful import Api
from flask_cors import CORS


class Database:

    def __init__(self, name):
        app = Flask(name)
        app.config['MYSQL_DATABASE_HOST'] = 'localhost'
        app.config['MYSQL_DATABASE_USER'] = 'iweb'
        app.config['MYSQL_DATABASE_PASSWORD'] = 'iweb'
        app.config['MYSQL_DATABASE_DB'] = 'iweb'
        self._mysql = MySQL()
        self._mysql.init_app(app)
        self._api = Api(app)
        CORS(app)

    @property
    def mysql(self):
        return self._mysql

    @property
    def api(self):
        return self._api

