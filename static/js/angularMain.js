var app=angular.module('pvshower', []);

app.controller('controller', function ($scope, $http,$location) {
     var url = "http://localhost:5000/modulos";
    var config={
        headers:{
            'Content-Type': 'application/json;charset=utf-8;'
        }
    };
    $http.get(url, config).then(function (response) {
        $scope.lista=response.data;
    }, function (response) {
    });

});