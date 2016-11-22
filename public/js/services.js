/**
 * Created by 1 on 11/22/2016.
 */

var services = angular.module('services', []);
services.factory('pointsService', ['$http', function ($http) {
    return {
        getPointsByDate:function (from, to) {
            return $http.get('/api/points/from=' + from + '/to=' + to);
        },
        lastPoint: function () {
            return $http.get('/api/points/quantity=1');
        }
    }
}]);