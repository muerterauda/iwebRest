var app = angular.module('appIweb', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/modulos', {
            templateUrl : 'modulos.html',
            controller: 'modulosController'
        })
        .when('/editarModulo', {
            templateUrl : 'editarModulo.html',
            controller: 'editarController'
        })
        .otherwise({
            templateUrl : 'principal.html',
            controller: 'principalController'
        });
});

app.controller('principalController', function ($scope, $location, $route) {

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

app.controller('modulosController');

app.controller('editarController');

