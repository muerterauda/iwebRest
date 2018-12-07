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
        }).when('/crearModulo', {
        templateUrl: 'vistaCrearModulo',
        controller: 'crearModuloController'
    }).when('/crearCampana', {
        templateUrl: 'vistaCrearCampana',
        controller: 'crearCampanaController'
    }).otherwise({
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

app.factory('emailCredentials', function () {
    var gmail = {
        username: "",
        email: ""
    };

    function setUserName(username) {
        gmail.username = username;
    }

    function setEmail(email) {
        gmail.email = email;
    }

    function getGmail() {
        return gmail;
    }

    return {
        setUserName: setUserName,
        setEmail: setEmail,
        getGmail: getGmail,

    };
});

function validEmail(emailCredentials) {
    var email1 = "pruebaparaingweb@gmail.com";
    var email2 = "alb.majora@gmail.com";
    var email3 = "gapriser@gmail.com";
    var email4 = "juanjogr19971901@gmail.com";


    var res =   emailCredentials.getGmail().email.localeCompare(email1) === 0 ||
                emailCredentials.getGmail().email.localeCompare(email2) === 0 ||
                emailCredentials.getGmail().email.localeCompare(email3) === 0 ||
                emailCredentials.getGmail().email.localeCompare(email4) === 0;

    return res;
}

app.controller('loginController', function ($scope, $http, emailCredentials) {

    $scope.onGoogleLogin = function () {
        var params = {
            'clientid': '286209566151-fovn4cmm3nvhsdjo0ns775r8n6ianoqm.apps.googleusercontent.com',
            'cookiepolicy': 'single_host_origin',
            'callback': function (result) {
                if(result['status']['signed_in']){
                    var request = gapi.client.plus.people.get(
                        {
                            'userId': 'me'
                        }
                    );
                    request.execute(function(resp){
                        $scope.$apply(function(){
                            emailCredentials.setUserName(resp.displayName);
                            emailCredentials.setEmail(resp.emails[0].value);

                            if(validEmail(emailCredentials)){
                                $scope.Show = true;
                                $scope.mensaje = "Bienvenido, " + emailCredentials.getGmail().username;
                            } else {
                                $scope.Show = false
                                $scope.mensaje = "Usuario no registrado"
                            }
                        });
                    });

                }
            },
            'approvalprompt': 'force',
            'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read'
        };

        gapi.auth.signIn(params);
    }
    
    $scope.onGoogleLogout = function () {
        var token = gapi.auth.getToken();
        if (token) {
            var accessToken = gapi.auth.getToken().access_token;
            if (accessToken) {
                $http({
                    method: 'GET',
                    url: 'https://accounts.google.com/o/oauth2/revoke?token=' + accessToken
                });
            }
        }
        gapi.auth.setToken(null);
        gapi.auth.signOut();
        $scope.mensaje = emailCredentials.setUserName();    // Esta línea demuestra que se ha realizado el Logout con éxito (no devuelve nada).
        $scope.Show = false;
    }
})

app.controller('principalController', function ($scope, $http, $location, $route, importarModulo, emailCredentials) {

    $scope.mensaje = "";
    $scope.error = "";
    if(emailCredentials.getGmail().email.localeCompare("alb.majora@gmail.com") === 0){
        $scope.Show = true;
    } else {
        $scope.Show = false
    }

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
    $scope.crearModulo = function () {
        $location.path('/crearModulo');
        $route.reload();
    };
    $scope.editarModulo = function (id) {
        $location.path('/editarModulo');
        $route.reload();
    };
    $scope.borrarModulo = function (id) {
        $http({
            url: url,
            method: "DELETE",
            config: config,
            params: {id: id}
        }).then(function (response) {
            if (response.data == true) {
                $route.reload();
            } else {
                $scope.errorBorrado = "No se pudo borrar"
            }
        });
    };
    $scope.borrarCampana = function (id, modulo) {
        $http({
            url: url.replace('modulos', 'campanas'),
            method: "DELETE",
            config: config,
            params: {id: id}
        }).then(function (response) {
            if (response.data == true) {
                $scope.listacampana = mostrarCampanasModulo.borrarModulo(modulo, $scope.listacampana);
                mostrarCampanasModulo.anadirCampanas(modulo).then(function (promise) {
                    if ($scope.listacampana === undefined) {
                        $scope.listacampana = promise;
                    } else {
                        $scope.listacampana = $scope.listacampana.concat(promise);
                    }
                });
                mostrarCampanasModulo.anadirModulo(modulo);

            } else {
                $scope.errorBorrado = "No se pudo borrar"
            }
        });
    };
    $scope.crearCampana = function () {
        $location.path('/crearCampana');
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
        $location.path('busquedas.html');
        $route.reload();
    }
    $scope.editarModulo = function () {
        //TODO WEB SERVICE
        $location.path('/busquedas.html');
        $route.reload();
    }
    $scope.volver = function () {
        $location.path('/busquedas.html');
        $route.reload();
    }
});

app.controller('crearModuloController', function ($scope, $http, $location, $route, importarModulo) {
    var config = {
        headers: {
            'Content-Type': 'application/json;charset=utf-8;'
        }
    };

    $scope.crearModulo = function () {
        var url = "http://localhost:5000/iweb/v1/modulos";

        var nombre = $scope.nombre;
        var alfa = $scope.alfa;
        var gamma = $scope.gamma;
        var beta = $scope.beta;
        var kappa = $scope.kappa;

        if (nombre == null || alfa == null || gamma == null || beta == null || kappa == null) {
            $scope.errorCreado = "Rellene todos los campos";
        } else {
            importarModulo.setName(nombre);
            importarModulo.setAlfa(alfa);
            importarModulo.setBeta(beta);
            importarModulo.setGamma(gamma);
            importarModulo.setKappa(kappa);
            $http.post(url, importarModulo.getModulo(), config).then(function (response) {
                if (response.data == true) {
                    $scope.erroNombre = "";
                    $scope.errorCreado = "";
                    $location.path('/modulos');
                    $route.reload();
                } else {
                    $scope.erroNombre = "Ya existe un modulo con este nombre";
                }
            });
        }
    };


    $scope.goBack = function () {
        $location.path('/modulos');
        $route.reload();
    };
});

app.controller('crearCampanaController', function ($http, $location, $route, $scope) {
    var config = {
        headers: {
            'Content-Type': 'application/json;charset=utf-8;'
        }
    };

    $http.get("http://localhost:5000/iweb/v1/modulos", config).then(function (response) {
        $scope.lista = response.data;
    }, function (response) {
    });

    $scope.crearCampana = function () {
        var url = "http://localhost:5000/iweb/v1/campanas";

        var moduloID = $scope.moduloSeleccionado;
        moduloID = moduloID.id;
        var nombre = $scope.nombre;
        var fechaIni = $scope.fechaIni;
        var fechaFin = $scope.fechaFin;
        var validformat = /^\d{4}\/\d{2}\/\d{2}$/;
        if (fechaIni == null || fechaFin == null) {
            $scope.errorCreado = "Rellene el campo de búsqueda"
        } else if (!validformat.test(fechaIni) || !validformat.test(fechaFin)) {
            $scope.errorFecha = "Formato de fechas no válidos"
        } else {
            $http({
                url: url,
                method: "POST",
                config: config,
                params: {id: moduloID, fechaIni: fechaIni, fechaFin: fechaFin, nombre: nombre}
            }).then(function (response) {
                $location.path('/modulos');
                $route.reload();
            });
        }
    };

    $scope.goBack = function () {
        $location.path('/modulos');
        $route.reload();
    };
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

