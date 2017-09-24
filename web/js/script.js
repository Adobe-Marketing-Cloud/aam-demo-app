
var app = angular.module('app', []);

app.controller('AppController', function AppController($scope, $http) {

    $http.get('/api/v1/users/self').then(function(response) {
        $scope.user = response.data;
    });

    $http.get('/api/v1/datasources/').then(function(response) {
        $scope.datasources = response.data;
    });
});