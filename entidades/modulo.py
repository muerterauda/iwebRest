import entidades.database
from flask_restful import Resource
import json
import entidades.util

class Modulo(Resource):

    cur = entidades.database.cursor
    headers = None

    @entidades.database.app.route("/modulos", methods=['GET'])
    def get_all(self):
        self.cur.execute("SELECT * FROM MODULO")
        if self.headers != None:
            self.headers = [x[0] for x in self.cur.description]

        datos = self.cur.fetchall()
        return json.loads(entidades.util.parseJSON(self.headers, datos))
