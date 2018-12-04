var app=angular.module('pvshowerTest', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
        .when('/addModulo',{
            templateUrl: 'testCrearModulo.html',
            controller: 'controllerModulo'
        })
        .when('/editModulo',{
            templateUrl: 'testEditarModulo.html',
            controller: 'controllerModulo'

        }).when('/addCampana',{
                templateUrl: 'testCrearCampana.html',
                controller: 'controllerCampana'
        }).when('/editCampana', {
            templateUrl: 'testEditarCampana.html',
            controller: 'controllerCampana'
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
        var url = "http://localhost:5000/iweb/v1/campanas/"+id;
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

app.controller('controllerTest', function ($scope, $http,$location, $route, mostrarCampanasModulo) {
    mostrarCampanasModulo.restablecerCheckbox();
    var url = "http://localhost:5000modulos";
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

app.controller('controllerCampana',  function ($scope, $http,$location, $route) {
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

    $scope.volver = function () {
        $location.path('/testMain.html');
        $route.reload();
    }
});

app.controller('controllerModulo', function($scope, $http,$location, $route){
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

