from flask import Flask, request
import json
import entidades.util
from flask import jsonify
from entidades.database import Database

app = Flask(__name__)

_db = Database(app)


@app.route("/modulos", methods=['GET'])
def get(): # Obtener todos los modulos almacenados en el sistema
    id = request.values.get("id")
    nombre = request.values.get("nombre")
    if not id and not nombre:
        _db.cursor.execute("SELECT * FROM MODULO")
    elif not nombre:
        _db.cursor.execute("SELECT * FROM MODULO WHERE id= %s", (id,))
    elif not id:
        _db.cursor.execute("SELECT * FROM MODULO WHERE nombre= %s", (nombre,))
    headers = [x[0] for x in _db.cursor.description]
    datos = _db.cursor.fetchall()
    final = entidades.util.parseJSON(headers, datos)
    return jsonify(json.loads(final))


@app.route("/modulos", methods=['POST'])
def create(): # Crear un modulo con sus parametros (opcionales todos menos nombre)
    res = True
    nombre = request.values.get("nombre")
    alpha = request.values.get("alpha")
    beta = request.values.get("beta")
    gamma = request.values.get("gamma")
    kappa = request.values.get("kappa")
    if (not nombre) and (not alpha) and (not beta) and (not gamma) and (not kappa):
        res = False
    else:
        n = _db.cursor.execute("INSERT INTO MODULO VALUES (0, %s, %s, %s, %s, %s)", (nombre, alpha, beta, gamma, kappa))
        if n == 0:
            res = False
    return jsonify(res)

@app.route("/modulos", methods=['DELETE'])
def delete(): # Eliminar un modulo a partir de su id
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
def update(): # Actualizar un modulo a partir de su id
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