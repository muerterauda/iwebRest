from flask import Flask, render_template
from flask_cors import CORS

app = (Flask(__name__))
CORS(app)

@app.route("/")
def getIndex():
    return render_template("index.html")

@app.route("/principal")
def getPrincipal():
    return render_template("principal.html")


@app.route("/vistaModulos")
def getModulosVista():
    return render_template("modulos.html")


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


if __name__ == "__main__":
    app.run(port=8080)
