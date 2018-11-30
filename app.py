from flask import Flask

import entidades.database
import entidades.modulo


exec(open('./entidades/campana.py').read())
exec(open('./entidades/modulo.py').read())
