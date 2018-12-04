import json
from flask import Flask, jsonify, request, Blueprint
import entidades.util
from flask_cors import CORS
from flask_restful import Api
from flaskext.mysql import MySQL

bp = Blueprint('iweb', __name__, template_folder='templates');

app = (Flask(__name__))

app.config['MYSQL_DATABASE_HOST'] = 'localhost'
app.config['MYSQL_DATABASE_USER'] = 'iweb'
app.config['MYSQL_DATABASE_PASSWORD'] = 'iweb'
app.config['MYSQL_DATABASE_DB'] = 'iweb'
# app.config["APPLICATION_ROOT"] = '/iweb/v1/'
mysql = MySQL()
mysql.init_app(app)
api = Api(app=app)
CORS(app)
cursor = mysql.connect().cursor()


@bp.route("/campana", methods=['GET'])
def get():  # obtener Campañas de Modulo
    id = request.values.get('id');
    numero = cursor.execute("select * from campaña where modulo = %s", (id,))
    if (numero > 0):
        row_headers = [x[0] for x in cursor.description]
        datos = entidades.util.parseListDateTime(cursor.fetchall())
        final = entidades.util.parseJSON(row_headers, datos)
        retorno = json.loads(final)
    else:
        retorno = False
    return jsonify(retorno)


@bp.route("/campana", methods=['POST'])
def create():  # crear Campaña asociada a Modulo con ID
    id = request.values.get('id');
    nombre = request.values.get('nombre')
    fechaIni = request.values.get('fechaIni')
    fechaFin = request.values.get('fechaFin')
    valor = True
    numero = cursor.execute("INSERT INTO campaña VALUES (0, %s, %s, %s, %s)", (id, nombre, fechaIni, fechaFin,))
    if (numero == 0):
        valor = False
    return jsonify(valor)


@bp.route("/campana", methods=['PUT'])
def update():  # editar Campaña asociada a Modulo con ID
    fechaIni = request.values.get('fechaIni')
    fechaFin = request.values.get('fechaFin')
    valor = True
    numero = cursor.execute("UPDATE campaña SET fechaInicio = %s, fechaFin = %s WHERE id = %s",
                            (fechaIni, fechaFin,))
    if (numero == 0):
        valor = False
    return jsonify(valor)


@bp.route("/campana", methods=['DELETE'])
def delete():  #
    id = request.values.get('id')
    valor = True
    numero = cursor.execute("DELETE FROM campaña WHERE id = %s", (id,))
    if (numero == 0):
        valor = False
    return jsonify(valor)


@bp.route("/modulos", methods=['GET'])
def get_all():  # Obtener todos los modulos almacenados en el sistema
    cursor.execute("SELECT * FROM MODULO")
    headers = [x[0] for x in cursor.description]
    datos = cursor.fetchall()
    final = entidades.util.parseJSON(headers, datos)
    return jsonify(json.loads(final))


@bp.route("/modulos", methods=['POST'])
def create_modulo():  # Crear un modulo con sus parametros (opcionales todos menos nombre)
    res = True
    nombre = request.values.get("nombre")
    alpha = request.values.get("alpha")
    beta = request.values.get("beta")
    gamma = request.values.get("gamma")
    kappa = request.values.get("kappa")
    if (not nombre) and (not alpha) and (not beta) and (not gamma) and (not kappa):
        res = False
    else:
        n = cursor.execute("INSERT INTO MODULO VALUES (0, %s, %s, %s, %s, %s)", (nombre, alpha, beta, gamma, kappa))
        if n == 0:
            res = False
    return jsonify(res)


@bp.route("/modulos", methods=['DELETE'])
def create_delete():  # Eliminar un modulo a partir de su id
    res = True
    id = request.values.get("id")
    if not id:
        res = False
    else:
        n = cursor.execute("DELETE FROM MODULO WHERE id = %s", (id,))
        if n == 0:
            res = False
    return jsonify(res)


@bp.route("/modulos", methods=['PUT'])
def create_update():  # Actualizar un modulo a partir de su id
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
        n = cursor.execute('UPDATE MODULO SET nombre = %s, alfa = %s, beta = %s, gamma = %s, kappa = %s '
                           'WHERE id = %s', (nombre, alpha, beta, gamma, kappa, id))
        if n == 0:
            res = False
    return jsonify(res)


app.register_blueprint(bp, url_prefix='/iweb/v1/')
app.run();
