'use strict';

var app = angular.module('coffee', []);

app.controller('MainCtrl', [
  '$scope',
  function($scope) {
    $scope.test = 'Hello World!';
    $scope.drinks = [
      {title: 'coffee 1', upvotes: 5},
      {title: 'coffee 2', upvotes: 2},
      {title: 'coffee 3', upvotes: 15},
      {title: 'coffee 4', upvotes: 9},
      {title: 'coffee 5', upvotes: 4}
    ];
    $scope.addDrink = function () {
      if(!$scope.title || $scope.title === '') { return; }
      $scope.drinks.push({title: $scope.title, upvotes: 0});
    };
  }
]);
