from flask import Flask, request
import json
import entidades.util
from flask import jsonify
from entidades.database import Database

app = Flask(__name__)

_db = Database(app)


@app.route("/modulos", methods=['GET'])
def get_all():
    _db.cursor.execute("SELECT * FROM MODULO")
    headers = [x[0] for x in _db.cursor.description]
    datos = _db.cursor.fetchall()
    final = entidades.util.parseJSON(headers, datos)
    return jsonify(json.loads(final))


@app.route("/modulos", methods=['POST'])
def create():
    res = True
    nombre = request.values.get("nombre")
    alpha = request.values.get("alpha")
    beta = request.values.get("beta")
    gamma = request.values.get("gamma")
    kappa = request.values.get("kappa")
    if (not nombre) and (not alpha) and (not beta) and (not gamma) and (not kappa):
        res = False
    else:
        n = _db.cursor.execute("INSERT INTO MODULO VALUES (%s, %s, %s, %s, %s)", (nombre, alpha, beta, gamma, kappa))
        if n == 0:
            res = False
    return jsonify(res)

@app.route("/modulos", methods=['DELETE'])
def delete():
    res = True
    id = request.values.get("id")
    if not id:
        res = False
    else:
        n = _db.cursor.execute("DELETE FROM MODULO WHERE id = %s", (id, ))
        if n == 0:
            res = False
    return jsonify(res)

@app.route("/modulos", methods=['PUT'])
def update(id, nombre, alpha, beta, gamma, kappa):
    res = True
    id = request.values.get("id")
    nombre = request.values.get("nombre")
    alpha = request.values.get("alpha")
    beta = request.values.get("beta")
    gamma = request.values.get("gamma")
    kappa = request.values.get("kappa")
    if (not nombre) and (not alpha) and (not beta) and (not gamma) and (not kappa):
        res = False
    else:
        n = _db.cursor.execute('UPDATE MODULO SET nombre = %s, alfa = %s, beta = %s, gamma = %s, kappa = %s '
                            'WHERE id = %s', (nombre, alpha, beta, gamma, kappa, id))
        if n == 0:
            res = False
    return jsonify(res)

app.run()