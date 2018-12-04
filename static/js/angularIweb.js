var app = angular.module('appIweb', ['ngRoute']).config(function($interpolateProvider){
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});;

app.config(function ($routeProvider) {
    $routeProvider
        .when('/modulos', {
            templateUrl : 'vistaModulos',
            controller: 'modulosController'
        })
        .when('/editarModulo', {
            templateUrl : 'editarModulo',
            controller: 'editarController'
        })
        .otherwise({
            templateUrl : 'principal',
            controller: 'principalController'
        });
});
app.factory('mostrarCampanasModulo', function ($http) {
    var listaModulosMostrar={
        listaModulos: []
    };
    function resetAnadir(id){
        var url = "http://localhost:5000/iweb/v1/campanas?id="+id;
        var config={
            headers:{
                'Content-Type': 'application/json;charset=utf-8;'
            }
        };
        var promise=$http.get(url,config).then(function (response) {
            return response.data;
        }, function (response) {
        });
        return promise;
    };
    function resetBorrar(id, listaCampana){
        if(listaCampana!==[]){
            listaCampana=listaCampana.filter(function(value){
             return value.modulo!==id;
       });
        }
       return listaCampana;
    }
    function anadir(id){
        var idM=findModulo(id);
        if (idM===-1){
            listaModulosMostrar.listaModulos.push(id)
        }

    };
    function borrar(id, lista){
       var idM=findModulo(id);
        if (idM!==-1){
            listaModulosMostrar.listaModulos.splice(idM,1);
        }
        return resetBorrar(id,lista);
    };
    function restablecerCheckbox(){
        listaModulosMostrar.listaModulos=[];
    }
    function findModulo(id){
       return listaModulosMostrar.listaModulos.indexOf(id);
    }
      return {
          findModulo: findModulo,
          anadirModulo: anadir,
          borrarModulo: borrar,
          anadirCampanas: resetAnadir,
          restablecerCheckbox:restablecerCheckbox
    };
})
app.controller('principalController', function ($scope, $http, $location, $route) {

    $scope.mensaje = "";
    $scope.error = "";

    $scope.verModulos = function () {
        $location.path('/modulos');
        $route.reload();
    };

    $scope.importar = function () {
        //opción de importar Objeto: $scope.archivo
    }
});

app.controller('modulosController', function ($scope, $http,$location, $route, mostrarCampanasModulo){
    mostrarCampanasModulo.restablecerCheckbox();
    var url = "http://localhost:5000/iweb/v1/modulos";
    var config={
        headers:{
            'Content-Type': 'application/json;charset=utf-8;'
        }
    };
    $scope.sortType     = 'nombre';
    $scope.sortReverse  = false;
    $scope.sortTypeC    = 'id';
    $scope.sortReverseC  = false;
    $http.get(url, config).then(function (response) {
        $scope.lista=response.data;
    }, function (response) {
    });
    $scope.cambiarIcono =function(valor, procedencia){
        if(procedencia===0){
             if(valor===$scope.sortType){
            $scope.sortReverse  = !$scope.sortReverse;
        }else{
            $scope.sortType =  valor;
            $scope.sortReverse  = false;
        }
        }else if(procedencia===1){
             if(valor===$scope.sortTypeC){
            $scope.sortReverseC  = !$scope.sortReverseC;
        }else{
            $scope.sortTypeC =  valor;
            $scope.sortReverseC  = false;
        }
        }

    };
    $scope.mostrarCampanas=function (id) {
        if(mostrarCampanasModulo.findModulo(id)===-1){
            mostrarCampanasModulo.anadirCampanas(id).then(function(promise){
                if($scope.listacampana===undefined){
                    $scope.listacampana=promise;
                }else{
                    $scope.listacampana=$scope.listacampana.concat(promise);
                }
            });
            mostrarCampanasModulo.anadirModulo(id);
        }else{
            $scope.listacampana=mostrarCampanasModulo.borrarModulo(id, $scope.listacampana);
        }
    };
    $scope.addModulo = function() {
        $location.path('/addModulo');
        $route.reload();
    };
    $scope.editarModulo = function(id) {
        $location.path('/editarModulo');
        $route.reload();
    };
    $scope.borrarModulo = function(id) {
        //Consulta a servicios
        $route.reload();
    };
    $scope.addCampana = function(){
        $location.path('/addCampana');
        $route.reload();
    };
    $scope.editCampana = function(id){
        $location.path('/editCampana');
        $route.reload();
    }
});

app.controller('editarModuloController', function($scope, $http,$location, $route){
    $scope.crearModulo = function(){
        //TODO WEB SERVICE
        $location.path('testMain.html');
        $route.reload();
    }
    $scope.editarModulo = function(){
        //TODO WEB SERVICE
        $location.path('/testMain.html');
        $route.reload();
    }
    $scope.volver = function () {
        $location.path('/testMain.html');
        $route.reload();
    }
});

