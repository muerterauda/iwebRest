var app=angular.module('pvshowerTest', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
        .when('/addModulo',{
            templateUrl: 'testCrearModulo.html',
            controller: 'crearModulo'
        })
        .when('/editModulo',{
            templateUrl: 'testEditarModulo.html',
            controller: 'editModulo'
        })
        .otherwise({
            templateUrl: 'testMain.html',
            controller: 'controllerTest'
        });
});

app.factory('mostrarCampanasModulo', function () {
    var listaModulosMostrar={
        listaModulos: []
    };
    function reset(){

    }
    function anadir(id){
        if (listaModulosMostrar.listaModulos.find(id)===undefined){
            listaModulosMostrar.push(id)
        }
    };
    function borrar(id){
        var idM=listaModulosMostrar.listaModulos.find(id);
        if (idM!==undefined){
            listaModulosMostrar.listaModulos.splice(idM,idM);
        }
    };
    function findModulo(id){
        return listaModulosMostrar.listaModulos.find(id);
    }
      return {
        findModulo: findModulo,
        anadirModulo: anadir,
        borrarModulo: borrar
    };
})

app.controller('controllerTest', function ($scope, $http,$location, $route, mostrarCampanasModulo) {
    var url = "http://localhost:5000/modulos";
    var config={
        headers:{
            'Content-Type': 'application/json;charset=utf-8;'
        }
    };
    $scope.sortType     = 'nombre';
    $scope.sortReverse  = false;
    $http.get(url, config).then(function (response) {
        $scope.lista=response.data;
    }, function (response) {
    });
    $scope.cambiarIcono =function(valor){
        if(valor===$scope.sortType){
            $scope.sortReverse  = !$scope.sortReverse;
        }else{
            $scope.sortType =  valor;
            $scope.sortReverse  = false;
        }
    };
    $scope.mostrarCampanas=function (id) {
        if(mostrarCampanasModulo.findModulo(id)===undefined){
            mostrarCampanasModulo.anadirModulo(id);
        }else{
            mostrarCampanasModulo.borrarModulo(id);
        }
        $route.reload();
    };
    $scope.addModulo = function() {
        $location.path('/addModulo');
        $route.reload();
    };
    $scope.editarModulo = function(id) {
        $location.path('/editModulo');
        $route.reload();
    };
    $scope.borrarModulo = function(id) {
        //Consulta a servicios
        $route.reload();
    };
});