import entidades.database
from flask_restful import Resource
import json
import entidades.util

class Modulo(Resource):

    cur = entidades.database.cursor
    headers = None

    @entidades.database.api.route("/modulos", methods=['GET'])
    def get_all(self):
        self.cur.execute("SELECT * FROM MODULO")
        if self.headers is None:
            self.headers = [x[0] for x in self.cur.description]

        datos = self.cur.fetchall()
        return json.loads(entidades.util.parseJSON(self.headers, datos))

    @entidades.database.api.route("/modulos", method=['POST'])
    def create(self, nombre, alpha=0, beta=0, gamma=0, kappa=0):
        self.cur.execute("INSERT INTO MODULO VALUES (%(nombre)s, %(alpha)s, %(beta)s, %(gamma)s, %(kappa)s)")
        if self.headers is None:
            self.headers = [x[0] for x in self.cur.description]
