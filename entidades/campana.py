import json
from flask import Flask, jsonify
from flask_restful import Resource
from entidades.database import Database
import entidades.util

app = Flask(__name__)

_db = Database(app)


@app.route("/campana/<int:id>", methods=['GET'])
def get(id):  # obtener Campañas de Modulo
    _db.cursor.execute("select * from campaña where modulo = %s", (id,))
    row_headers = [x[0] for x in _db.cursor.description]
    datos = entidades.util.parseListDateTime(_db.cursor.fetchall())
    final = entidades.util.parseJSON(row_headers, datos)
    return jsonify(json.loads(final))


#
# @app.route("/campana/", methods=['PUT'])
# def put(self, id, nombre, fechaIni, fechaFin):  # crear Campaña asociada a Modulo con ID
#     self._db.cursor.execute("INSERT INTO campaña VALUES (%d, %s, %s, %s)", (id, nombre, fechaIni, fechaFin,))
#     row_headers = [x[0] for x in self._db.cursor.description]
#     datos = self._db.cursor.fetchall()
#     final = entidades.util.parseJSON(row_headers, datos)
#     return json.loads(final)
