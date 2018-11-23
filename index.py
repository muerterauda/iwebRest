from flask import Flask
from flaskext.mysql import MySQL
from flask_restful import Resource, Api
from flask import render_template
import json
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


class Modulos(Resource):
    def get(self):
        cur = mysql.get_db().cursor()
        cur.execute("Select * from modulo")
        row_headers = [x[0] for x in cur.description]
        string = cur.fetchall()
        json_data = []
        for result in string:
            json_data.append(dict(zip(row_headers, result)))
        finalstring = json.dumps(json_data)
        return json.loads(finalstring)


api.add_resource(Modulos, '/modulos')


if __name__ == '__main__':
    app.run()

