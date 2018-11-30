from flask import Flask
from flaskext.mysql import MySQL
from flask_restful import Api
from flask_cors import CORS


class Database:

    def __init__(self, app):
        app.config['MYSQL_DATABASE_HOST'] = 'localhost'
        app.config['MYSQL_DATABASE_USER'] = 'iweb'
        app.config['MYSQL_DATABASE_PASSWORD'] = 'iweb'
        app.config['MYSQL_DATABASE_DB'] = 'iweb'
        mysql = MySQL()
        mysql.init_app(app)
        self._api = Api(app)
        CORS(app)
        self._cursor = mysql.connect().cursor()

    @property
    def cursor(self):
        return self._cursor

    @property
    def api(self):
        return self._api

    @property
    def app(self):
        return self._app