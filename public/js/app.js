/**
 * Created by kasyan on 11/25/16.
 */
angular.module('trackerApp', ['services'])
    .controller('pointsController', ['$log', '$scope', 'pointsService',function ($log, $scope, pointsService) {
        $log.debug(Object.keys($scope));
        pointsService.lastPoint().then(function (response) {
            $log.debug('response data =', response.data);
            $scope.point = response.data[0];
        });
        var urls = ['https://pp.vk.me/c837434/v837434471/df38/Ai31C8HOtgU.jpg',
            'https://pp.vk.me/c543107/v543107888/3a566/pFXO6YYaTkA.jpg',
        'https://pp.vk.me/c836727/v836727420/ec8b/h7m7sAoxrp8.jpg'];
        var i = 0;
        $scope.url = urls[i];
        $scope.changeUrl = function() {
            $scope.url = urls[++i % urls.length];
        }
        $scope.date = new Date();
        //$interval($scope.changeUrl, 5000);
        $scope.car = 'BMW';
        $scope.cars = [];
        $scope.addCar = function() {
            $scope.cars.push($scope.car);
        }
        $scope.remove = function() {
            $scope.cars.pop();
        }
        $scope.$watch('cars', function(newCar, oldCar) {
            $log.debug($scope.cars.length, ' ', newCar, ' ', oldCar);
        }, true);
    }]);