from flask import Flask
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
def create(nombre, alpha=0, beta=0, gamma=0, kappa=0):
    _db.cursor.execute("INSERT INTO MODULO VALUES (%s, %s, %s, %s, %s)", (nombre, alpha, beta, gamma, kappa))


@app.route("/modulos/<int:id>", methods=['DELETE'])
def delete(id):
    _db.cursor.execute("DELETE FROM MODULO WHERE id = %s", (id, ))


@app.route("/modulos/<int:id>", methods=['PUT'])
def update(id, nombre, alpha, beta, gamma, kappa):
    _db.cursor.execute('UPDATE MODULO SET nombre = %s, alfa = %s, beta = %s, gamma = %s, kappa = %s '
                            'WHERE id = %s', (nombre, alpha, beta, gamma, kappa, id))


app.run()