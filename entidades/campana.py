import json
from flask import Flask, jsonify, request
from entidades.database import Database
import entidades.util

app = Flask(__name__)

_db = Database(app)


@app.route("/campanas", methods=['GET'])
def get():  # obtener Campañas de Modulo
    id = request.values.get('id');
    fechaIni = request.values.get('fechaIni');
    if (not fechaIni):
        _db.cursor.execute("select * from campaña where modulo = %s", (id,))
    else:
        _db.cursor.execute("select * from campaña where modulo = %s and fechaInicio = %s", (id, fechaIni,))
    row_headers = [x[0] for x in _db.cursor.description]
    datos = entidades.util.parseListDateTime(_db.cursor.fetchall())
    final = entidades.util.parseJSON(row_headers, datos)
    retorno = json.loads(final)
    return jsonify(retorno)


@app.route("/campanas", methods=['POST'])
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


@app.route("/campanas", methods=['PUT'])
def update():  # editar Campaña asociada a Modulo con ID
    fechaIni = request.values.get('fechaIni')
    fechaFin = request.values.get('fechaFin')
    valor = True
    numero = _db.cursor.execute("UPDATE campaña SET fechaInicio = %s, fechaFin = %s WHERE id = %s",
                                (fechaIni, fechaFin,))
    if (numero == 0):
        valor = False
    return jsonify(valor)


@app.route("/campanas", methods=['DELETE'])
def delete(): #
    id = request.values.get('id')
    valor = True
    numero = _db.cursor.execute("DELETE FROM campaña WHERE id = %s", (id,))
    if(numero==0):
        valor = False
    return jsonify(valor)

