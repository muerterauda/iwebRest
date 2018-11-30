import entidades.database
from flask_restful import Resource
import json
from entidades.database import Database

db = Database();


class Modulo(Resource):
    _db = Database()

    @_db.api.route("/modulos", methods=['GET'])
    def get_all(self):
        self._db.cursor.execute("SELECT * FROM MODULO")
        if self.headers is None:
            self.headers = [x[0] for x in self.cur.description]

        datos = self.cur.fetchall()
        return json.loads(entidades.util.parseJSON(self.headers, datos))

    @_db.api.route("/modulos", method=['POST'])
    def create(self, nombre, alpha=0, beta=0, gamma=0, kappa=0):
        self._db.cursor.execute("INSERT INTO MODULO VALUES (%s, %s, %s, %s, %s)", (nombre, alpha, beta, gamma, kappa))

    @_db.api.route("/modulos/<int:id>", method=['DELETE'])
    def delete(self, id):
        self._db.cursor.execute("DELETE FROM MODULO WHERE id = %s", (id,))

    @_db.api.route("/modulos/<int:id>", method=['PUT'])
    def update(self, id, nombre, alpha, beta, gamma, kappa):
        self._db.cursor.execute('UPDATE MODULO SET nombre = %s, alfa = %s, beta = %s, gamma = %s, kappa = %s '
                                'WHERE id = %s', (nombre, alpha, beta, gamma, kappa, id))


db.app.run()
