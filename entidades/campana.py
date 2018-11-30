import json

from flask_restful import Resource

import entidades.util
from entidades.database import Database

db = Database(__name__);
mysql = db.mysql


def parseListDateTime(datos):
    datos = list(datos)
    datos = [list(x) for x in datos]
    for x in datos:
        x[3] = x[3].strftime("%Y-%m-%d");
        x[4] = x[4].strftime("%Y-%m-%d");
    return datos


class CampanaId(Resource):  # id Modulo
    def get(self, id):  # obtener Campañas de Modulo
        cur = mysql.get_db().cursor()
        cur.execute("select * from campaña where modulo = %s", (id,));
        row_headers = [x[0] for x in cur.description]
        datos = entidades.util.parseListDateTime(cur.fetchall());
        final = entidades.util.parseJSON(row_headers, datos)
        return json.loads(final)

    def put(self, id, nombre, fechaIni, fechaFin):  # crear Campaña asociada a Modulo
        cur = mysql.get_db().cursor()
        cur.execute("INSERT INTO campaña VALUES (%d, %s, %s, %s)", (id, nombre, fechaIni, fechaFin));
        row_headers = [x[0] for x in cur.description]
        datos = cur.fetchall()
        final = entidades.util.parseJSON(row_headers, datos)
        return json.loads(final)


db.api.add_resource(CampanaId, '/campana/<int:id>')
