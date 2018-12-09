import json
from flask import Flask, jsonify, request, Blueprint, render_template
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
mysql = MySQL()
mysql.init_app(app)
api = Api(app)
CORS(app)
cursor = mysql.connect().cursor()


@app.route("/")
def getIndex():
    return render_template("index.html")


@app.route("/principal")
def getPrincipal():
    return render_template("principal.html")


@app.route("/vistaModulos")
def getModulosVista():
    return render_template("modulos.html")

@app.route("/editarCampana")
def getEditarCampanaVista():
    return render_template("editarCampana.html")


@app.route("/editarModulo")
def getEditarModuloVista():
    return render_template("editarModulo.html")


@app.route("/vistaCrearModulo")
def getCrearModulo():
    return render_template("crearModulo.html")


@app.route("/vistaCrearCampana")
def getCrearCampana():
    return render_template("crearCampana.html")


@app.route("/busquedasServer")
def getBusquedasVista():
    return render_template("busquedas.html")


@bp.route("/campanas", methods=['GET'])
def getCampana():  # obtener Campañas de Modulo
    id = request.values.get('id');
    idCampana = request.values.get('idCampana')
    fechaIni = request.values.get('fechaIni');
    if (fechaIni is not None):
        fechaIni = fechaIni.replace('/', '-')
    if(idCampana is not None):
        cursor.execute("select * from campana where id = %s", (idCampana,))
    elif (not fechaIni):
        cursor.execute("select * from campana where modulo = %s", (id,))
    else:
        cursor.execute("select * from campana where fechaInicio = %s", (fechaIni,))
    row_headers = [x[0] for x in cursor.description]
    datos = entidades.util.parseListDateTime(cursor.fetchall())
    final = entidades.util.parseJSON(row_headers, datos)
    retorno = json.loads(final)
    return jsonify(retorno)


@bp.route("/campanas", methods=['POST'])
def createCampana():  # crear Campaña asociada a Modulo con ID
    id = request.values.get('id');
    print(id)
    nombre = request.values.get('nombre')
    print(nombre)
    fechaIni = request.values.get('fechaIni')
    fechaFin = request.values.get('fechaFin')
    fechaIni = fechaIni.replace('/', '-')
    fechaFin = fechaFin.replace('/', '-')
    print(id+nombre+fechaFin+fechaIni)
    valor = True
    numero = cursor.execute("INSERT INTO campana VALUES (0, %s, %s, %s, %s)", (id, nombre, fechaIni, fechaFin,))
    if (numero == 0):
        valor = False
    return jsonify(valor)


@bp.route("/campanas", methods=['PUT'])
def updateCampana():  # editar Campaña asociada a Modulo con ID
    id = request.values.get('id')
    fechaIni = request.values.get('fechaIni').replace('/', '-')
    fechaFin = request.values.get('fechaFin').replace('/', '-')
    valor = True
    numero = cursor.execute("UPDATE campana SET fechaInicio = %s, fechaFin = %s WHERE id = %s",
                            (fechaIni, fechaFin, id,))
    if (numero == 0):
        valor = False
    return jsonify(valor)


@bp.route("/campanas", methods=['DELETE'])
def deleteCamapana():  #
    id = request.values.get('id')
    valor = True
    numero = cursor.execute("DELETE FROM campana WHERE id = %s", (id,))
    if (numero == 0):
        valor = False
    return jsonify(valor)


@bp.route("/modulos", methods=['GET'])
def getModulo():  # Obtener todos los modulos almacenados en el sistema
    id = request.values.get("id")
    nombre = request.values.get("nombre")
    if not id and not nombre:
        cursor.execute("SELECT * FROM MODULO")
    elif not nombre:
        cursor.execute("SELECT * FROM MODULO WHERE id= %s", (id,))
    elif not id:
        cursor.execute("SELECT * FROM MODULO WHERE nombre= %s", (nombre,))
    headers = [x[0] for x in cursor.description]
    datos = cursor.fetchall()
    final = entidades.util.parseJSON(headers, datos)
    return jsonify(json.loads(final))


@bp.route("/modulos", methods=['POST'])
def createModulo():  # Crear un modulo con sus parametros (opcionales todos menos nombre)
    res = True
    json = request.json
    nombre = json.get("nombre")
    alfa = json.get("alfa")
    beta = json.get("beta")
    gamma = json.get("gamma")
    kappa = json.get("kappa")

    if (not nombre) or (not alfa) or (not beta) or (not gamma) or (not kappa):
        res = False
    else:
        nombre = str(nombre).replace("\r", "")
        alfa = str(alfa).replace("\r", "")
        beta = str(beta).replace("\r", "")
        gamma = str(gamma).replace("\r", "")
        kappa = str(kappa).replace("\r", "")
        try:
            cursor.execute("INSERT INTO MODULO VALUES (0, %s, %s, %s, %s, %s)", (nombre, alfa, beta, gamma, kappa))
        except Exception:
            res = False
    return jsonify(res)


@bp.route("/modulos", methods=['DELETE'])
def deleteModulo():  # Eliminar un modulo a partir de su id
    res = True
    id = request.values.get("id")
    print(id)
    if not id:
        res = False
    else:
        n = cursor.execute("DELETE FROM MODULO WHERE id = %s", (id,))
        if n == 0:
            res = False
    return jsonify(res)


@bp.route("/modulos", methods=['PUT'])
def updateModulo():  # Actualizar un modulo a partir de su id
    res = True
    id = request.values.get("id")
    nombre = request.values.get("nombre")
    alpha = request.values.get("alfa")
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
