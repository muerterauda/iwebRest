import entidades.database
from flask_restful import Resource
import json
import entidades.util


class Modulo(Resource):

    cur = entidades.database.Database().get_cursor
    headers = None

    @entidades.database.Database.api.route("/modulos", methods=['GET'])
    def get_all(self):
        self.cur.execute("SELECT * FROM MODULO")
        if self.headers is None:
            self.headers = [x[0] for x in self.cur.description]

        datos = self.cur.fetchall()
        return json.loads(entidades.util.parseJSON(self.headers, datos))

    @entidades.database.Database.api.route("/modulos", method=['POST'])
    def create(self, nombre, alpha=0, beta=0, gamma=0, kappa=0):
        self.cur.execute("INSERT INTO MODULO VALUES (%s, %s, %s, %s, %s)", (nombre, alpha, beta, gamma, kappa))

    @entidades.database.Database.api.route("/modulos/<int:id>", method=['DELETE'])
    def delete(self, id):
        self.cur.execute("DELETE FROM MODULO WHERE id = %s", (id, ))

    @entidades.database.Database.api.route("/modulos/<int:id>", method=['PUT'])
    def update(self, id, nombre, alpha, beta, gamma, kappa):
        self.cur.execute("UPDATE MODULO SET nombre = %s, alpha = %s, beta = %s, gamma = %s, kappa = %s WHERE id = %s", (nombre, alpha, beta, gamma, kappa, id))

