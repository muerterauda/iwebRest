from flask_cors import CORS
from flask_restful import Api
from flaskext.mysql import MySQL


class Database(object):

    def __init__(self, app):
        self._app = app
        self._app.config['MYSQL_DATABASE_HOST'] = 'localhost'
        self._app.config['MYSQL_DATABASE_USER'] = 'iweb'
        self._app.config['MYSQL_DATABASE_PASSWORD'] = 'iweb'
        self._app.config['MYSQL_DATABASE_DB'] = 'iweb'
        mysql = MySQL()
        mysql.init_app(self._app)
        self._api = Api(self._app)
        CORS(self._app)
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
