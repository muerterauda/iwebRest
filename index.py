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


def parseJSON(headers, datasource):
    json_data = []
    for result in datasource:
        json_data.append(dict(zip(headers, result)))
    final = json.dumps(json_data)
    return final


class Modulo(Resource):
    def get(self, id):
        cur = mysql.get_db().cursor()
        cur.execute("Select * from modulo where id= %s", (id,))
        row_headers = [x[0] for x in cur.description]
        datos = cur.fetchall()
        final = parseJSON(row_headers, datos)
        return json.loads(final)


class Modulos(Resource):
    def get(self):
        cur = mysql.get_db().cursor()
        cur.execute("Select * from modulo")
        row_headers = [x[0] for x in cur.description]
        datos = cur.fetchall()
        final=parseJSON(row_headers,datos)
        return json.loads(final)


def parseListDateTime(datos):
    datos = list(datos)
    datos = [list(x) for x in datos]
    for x in datos:
        x[3] = x[3].strftime("%Y-%m-%d");
        x[4] = x[4].strftime("%Y-%m-%d");
    return datos


class CampanaId(Resource):  # id Modulo
    def get(self, id):  # obtener Campañas de Modulo
        cur = mysql.get_db().cursor();
        cur.execute("select * from campaña where modulo = %s", (id,));
        row_headers = [x[0] for x in cur.description]
        datos = parseListDateTime(cur.fetchall());
        final = parseJSON(row_headers, datos)
        return json.loads(final)


api.add_resource(Modulos, '/modulos')
api.add_resource(Modulo, '/modulos/<int:id>')
api.add_resource(CampanaId, '/campanas/<int:id>')

if __name__ == '__main__':
    app.run()

