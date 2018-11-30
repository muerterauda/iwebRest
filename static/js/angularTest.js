var app=angular.module('pvshowerTest', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
        .when('/addModulo',{
            templateUrl: 'testCrearModulo.html',
            controller: 'crearModulo'
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

app.controller('controllerTest', function ($scope, $http,$location, $route) {
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
    $scope.addModulo = function() {
        $location.path('/addModulo');
        $route.reload();
    };
    $scope.editar = function(id) {

    };
    $scope.borrar = function(id) {

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