var app=angular.module('pvshower', []);

app.controller('controller', function ($scope, $http,$location) {
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

    $scope.editar = function(id) {

    }
    $scope.borrar = function(id) {

    }
});