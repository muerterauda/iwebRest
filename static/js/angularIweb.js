var app = angular.module('appIweb', ['ngRoute']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});
;

app.config(function ($routeProvider) {
    $routeProvider
        .when('/modulos', {
            templateUrl: 'vistaModulos',
            controller: 'modulosController'
        })
        .when('/editarModulo', {
            templateUrl: 'editarModulo',
            controller: 'editarController'
        })
        .when('/busquedas', {
            templateUrl: 'busquedasServer',
            controller: 'busquedasController'
        })
        .otherwise({
            templateUrl: 'principal',
            controller: 'principalController'
        });
});
app.factory('importarModulo', function () {
    var modulo = {
        nombre: null,
        alfa: null,
        beta: null,
        gamma: null,
        kappa: null
    };

    function setName(nombre) {
        modulo.nombre = nombre;
    }

    function setAlfa(alfa) {
        modulo.alfa = alfa;
    }

    function setBeta(beta) {
        modulo.beta = beta;
    }

    function setGamma(gamma) {
        modulo.gamma = gamma;
    }

    function setKappa(kappa) {
        modulo.kappa = kappa;
    }

    function getModulo() {
        return modulo;
    }

    return {
        setName: setName,
        setAlfa: setAlfa,
        setBeta: setBeta,
        setGamma: setGamma,
        setKappa: setKappa,
        getModulo: getModulo
    };

});

app.factory('mostrarCampanasModulo', function ($http) {
    var listaModulosMostrar = {
        listaModulos: []
    };

    function resetAnadir(id) {
        var url = "http://localhost:5000/iweb/v1/campanas?id=" + id;
        var config = {
            headers: {
                'Content-Type': 'application/json;charset=utf-8;'
            }
        };
        var promise = $http.get(url, config).then(function (response) {
            return response.data;
        }, function (response) {
        });
        return promise;
    };

    function resetBorrar(id, listaCampana) {
        if (listaCampana !== []) {
            listaCampana = listaCampana.filter(function (value) {
                return value.modulo !== id;
            });
        }
        return listaCampana;
    }

    function anadir(id) {
        var idM = findModulo(id);
        if (idM === -1) {
            listaModulosMostrar.listaModulos.push(id)
        }

    };

    function borrar(id, lista) {
        var idM = findModulo(id);
        if (idM !== -1) {
            listaModulosMostrar.listaModulos.splice(idM, 1);
        }
        return resetBorrar(id, lista);
    };

    function restablecerCheckbox() {
        listaModulosMostrar.listaModulos = [];
    }

    function findModulo(id) {
        return listaModulosMostrar.listaModulos.indexOf(id);
    }

    return {
        findModulo: findModulo,
        anadirModulo: anadir,
        borrarModulo: borrar,
        anadirCampanas: resetAnadir,
        restablecerCheckbox: restablecerCheckbox
    };
})
app.controller('principalController', function ($scope, $http, $location, $route, importarModulo) {

    $scope.mensaje = "";
    $scope.error = "";

    $scope.verModulos = function () {
        $location.path('/modulos');
        $route.reload();
    };

    $scope.busquedas = function () {
        $location.path('/busquedas');
        $route.reload();
    };

    $scope.importar = function () {
        //opción de importar Objeto: $scope.archivo
        var f = document.getElementById('file').files[0],
            r = new FileReader();
        var lines;
        r.onload = function (e) {
            var data = e.target.result;
            lines = data.split("\n");
            if (lines.length > 20) {
                var nombre = lines[0].replace('/r', '');
                var alfa = lines[14].replace('/r', '');
                var beta = lines[16].replace('/r', '');
                var gamma = lines[18].replace('/r', '');
                var kappa = lines[20].replace('/r', '');
                importarModulo.setName(nombre);
                importarModulo.setAlfa(alfa);
                importarModulo.setBeta(beta);
                importarModulo.setGamma(gamma);
                importarModulo.setKappa(kappa);

                var url = "http://localhost:5000/iweb/v1/modulos";
                var config = {
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8;'
                    }
                };
                $http.post(url, importarModulo.getModulo(), config).then(function (response) {
                    if (response.data === false) {
                        $scope.error = "Importacion fallida: fichero no valido o modulo repetido";
                        $scope.mensaje = null;
                    } else {
                        $scope.mensaje = "Importacion realizada correctamente: modulo" + importarModulo.getModulo().nombre + " creado en el sistema";
                        $scope.error = null;
                    }

                }, function (response) {
                });
            } else {
                $scope.error = "Fichero erroneo";
                $scope.mensaje = null;
            }

        };
        r.readAsBinaryString(f);
    }
});

app.controller('modulosController', function ($scope, $http, $location, $route, mostrarCampanasModulo) {
    mostrarCampanasModulo.restablecerCheckbox();
    var url = "http://localhost:5000/iweb/v1/modulos";
    var config = {
        headers: {
            'Content-Type': 'application/json;charset=utf-8;'
        }
    };
    $scope.sortType = 'nombre';
    $scope.sortReverse = false;
    $scope.sortTypeC = 'id';
    $scope.sortReverseC = false;
    $http.get(url, config).then(function (response) {
        $scope.lista = response.data;
    }, function (response) {
    });
    $scope.cambiarIcono = function (valor, procedencia) {
        if (procedencia === 0) {
            if (valor === $scope.sortType) {
                $scope.sortReverse = !$scope.sortReverse;
            } else {
                $scope.sortType = valor;
                $scope.sortReverse = false;
            }
        } else if (procedencia === 1) {
            if (valor === $scope.sortTypeC) {
                $scope.sortReverseC = !$scope.sortReverseC;
            } else {
                $scope.sortTypeC = valor;
                $scope.sortReverseC = false;
            }
        }

    };
    $scope.mostrarCampanas = function (id) {
        if (mostrarCampanasModulo.findModulo(id) === -1) {
            mostrarCampanasModulo.anadirCampanas(id).then(function (promise) {
                if ($scope.listacampana === undefined) {
                    $scope.listacampana = promise;
                } else {
                    $scope.listacampana = $scope.listacampana.concat(promise);
                }
            });
            mostrarCampanasModulo.anadirModulo(id);
        } else {
            $scope.listacampana = mostrarCampanasModulo.borrarModulo(id, $scope.listacampana);
        }
    };
    $scope.addModulo = function () {
        $location.path('/addModulo');
        $route.reload();
    };
    $scope.editarModulo = function (id) {
        $location.path('/editarModulo');
        $route.reload();
    };
    $scope.borrarModulo = function (id) {
        //Consulta a servicios
        $route.reload();
    };
    $scope.addCampana = function () {
        $location.path('/addCampana');
        $route.reload();
    };
    $scope.editCampana = function (id) {
        $location.path('/editCampana');
        $route.reload();
    }
});

app.controller('editarModuloController', function ($scope, $http, $location, $route) {
    $scope.crearModulo = function () {
        //TODO WEB SERVICE
        $location.path('testMain.html');
        $route.reload();
    }
    $scope.editarModulo = function () {
        //TODO WEB SERVICE
        $location.path('/testMain.html');
        $route.reload();
    }
    $scope.volver = function () {
        $location.path('/testMain.html');
        $route.reload();
    }
});

app.controller('busquedasController', function ($scope, $http, $location, $route) {

    var config = {
        headers: {
            'Content-Type': 'application/json;charset=utf-8;'
        }
    };

    $scope.buscarModulo = function () {
        var nombre = $scope.nombreFiltrar;
        var url = "http://localhost:5000/iweb/v1/modulos";
        if (nombre != "" && nombre != null) {
            $http({
                url: url,
                method: "GET",
                config: config,
                params: {nombre: nombre}
            }).then(function (response) {
                if (response.data != null && response.data != "") {
                    $scope.noModulos = ""
                    $scope.lista = response.data;
                } else {
                    $scope.noModulos = "No existen modulos con el nombre " + nombre;
                }
            }, function (response) {
            });
        } else {
            $scope.noModulos = "Rellene el campo de búsqueda"
        }

    };

    $scope.buscarCampana = function () {
        var fechaIni = $scope.fechaIniFiltrar;
        var url = "http://localhost:5000/iweb/v1/campanas";
        var validformat = /^\d{4}\/\d{2}\/\d{2}$/;
        if (fechaIni == "" || fechaIni == null) {
            $scope.noCampanas = "Rellene el campo de búsqueda"
        } else if (!validformat.test(fechaIni)) {
            $scope.noCampanas = "Formato de fecha no válido"
        }
        else {
            $scope.noCampanas = ""
            $http({
                url: url,
                method: "GET",
                config: config,
                params: {fechaIni: fechaIni}
            }).then(function (response) {
                if (response.data != null && response.data != "") {
                    $scope.listacampana = response.data;
                } else {
                    $scope.noCampanas = "No hay resultados"
                }
            });
        }


    };

    $scope.goBack = function () {
        $location.path('/');
        $route.reload();
    };

});

