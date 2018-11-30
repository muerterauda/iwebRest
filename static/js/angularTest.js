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

        }).when('/addCampana',{
                templateUrl: 'testCrearCampana.html',
                controller: 'crearCampana'
        }).when('/editCampana', {
            templateUrl: 'testEditarCampana',
            controller: 'editarCampana'
    })
        .otherwise({
            templateUrl: 'testMain.html',
            controller: 'controllerTest'
        });
});

app.factory('mostrarCampanasModulo', function ($http) {
    var listaModulosMostrar={
        listaModulos: []
    };
    function resetAnadir(id){
        var url = "http://localhost:5000/campanas/"+id;
        var config={
            headers:{
                'Content-Type': 'application/json;charset=utf-8;'
            }
        };
        var promise=$http.get(url, config).then(function (response) {
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
    function findModulo(id){
       return listaModulosMostrar.listaModulos.indexOf(id);
    }
      return {
        findModulo: findModulo,
        anadirModulo: anadir,
        borrarModulo: borrar,
          anadirCampanas: resetAnadir
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
        $location.path('/editModulo');
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

app.controller('crearCampana',  function ($scope, $http,$location, $route) {
    $scope.crearCampana = function(){
        //TODO WEB SERVICE
        $location.path('/testMain.html');
        $route.reload();
    }
    $scope.editarCampana = function(){
        //TODO WEB SERVICE
        $location.path('/testMain.html');
        $route.reload();
    }
})