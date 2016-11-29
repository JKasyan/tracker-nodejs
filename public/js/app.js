/**
 * Created by kasyan on 11/25/16.
 */
var app = angular.module('trackerApp', ['services'])

    .controller('trackByDateController', ['$log', '$scope', 'mapService', function ($log, $scope, mapService) {
        $log.debug('trackByDateController');
        $scope.allDigits = mapService.all();
        //
        $scope.remove = function(index) {
            $log.debug(index);
            mapService.remove(index);
        }
    }])

    .controller('mapController', mapController);

function mapController($scope, $log, pointsService, mapService) {
    $log.debug('mapController');
    $scope.addDigit = function(digit) {
        mapService.add(angular.copy(digit));
    }
    $scope.data = mapService.all();
}

mapController.$inject = ['$scope', '$log', 'pointsService', 'mapService'];

app.factory('mapService', function() {
    var data = [1,2,3];
    return {
        add:function(digit) {
            data.push(digit);
        },
        all: function() {
            return data;
        },
        remove: function(index) {
            data.splice(index, 1);
        }
    }
});