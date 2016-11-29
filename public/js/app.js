/**
 * Created by kasyan on 11/25/16.
 */
var app = angular.module('trackerApp', ['services', 'uiGmapgoogle-maps'])

    .config(['uiGmapGoogleMapApiProvider', function(GoogleMapApiProviders) {
        GoogleMapApiProviders.configure({
            china: true
        });
    }])

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

function mapController($scope, $log, mapService) {
    $log.debug('mapController');
    $scope.addDigit = function(digit) {
        mapService.add(angular.copy(digit));
    }
    $scope.data = mapService.all();
    //
    $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
}

mapController.$inject = ['$scope', '$log', 'mapService'];

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