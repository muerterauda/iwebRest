import json
from flask import Flask, jsonify, request
from entidades.database import Database
import entidades.util

_db = Database(Flask(__name__))
app = _db.app


@app.route("/campana", methods=['GET'])
def get():  # obtener Campañas de Modulo
    id = request.values.get('id');
    numero = _db.cursor.execute("select * from campaña where modulo = %s", (id,))
    if (numero > 0):
        row_headers = [x[0] for x in _db.cursor.description]
        datos = entidades.util.parseListDateTime(_db.cursor.fetchall())
        final = entidades.util.parseJSON(row_headers, datos)
        retorno = json.loads(final)
    else:
        retorno = False
    return jsonify(retorno)


@app.route("/campana", methods=['POST'])
def create():  # crear Campaña asociada a Modulo con ID
    id = request.values.get('id');
    nombre = request.values.get('nombre')
    fechaIni = request.values.get('fechaIni')
    fechaFin = request.values.get('fechaFin')
    valor = True
    numero = _db.cursor.execute("INSERT INTO campaña VALUES (0, %s, %s, %s, %s)", (id, nombre, fechaIni, fechaFin,))
    if (numero == 0):
        valor = False
    return jsonify(valor)


@app.route("/campana", methods=['PUT'])
def update():  # editar Campaña asociada a Modulo con ID
    fechaIni = request.values.get('fechaIni')
    fechaFin = request.values.get('fechaFin')
    valor = True
    numero = _db.cursor.execute("UPDATE campaña SET fechaInicio = %s, fechaFin = %s WHERE id = %s",
                                (fechaIni, fechaFin,))
    if (numero == 0):
        valor = False
    return jsonify(valor)


@app.route("/campana", methods=['DELETE'])
def delete():  #
    id = request.values.get('id')
    valor = True
    numero = _db.cursor.execute("DELETE FROM campaña WHERE id = %s", (id,))
    if (numero == 0):
        valor = False
    return jsonify(valor)


app.run(port=5001, debug=False)