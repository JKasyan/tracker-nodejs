/**
 * Created by 1 on 11/22/2016.
 */

angular.module('services', [])
    .factory('pointsService', ['$http', function ($http) {
        return {
            getPointsByDate: function (from, to) {
                return $http.get('/api/points/from=' + from + '/to=' + to);
            },
            lastPoint: function () {
                return $http.get('/api/points/q=1');
            },
            auth: function (email, pass) {
                return $http({
                    method: 'POST',
                    url: '/api/authenticate',
                    params: {
                        email: email,
                        password: pass
                    },
                    headers: {'Content-Type': 'application/json '}
                });
            }
        }
    }]);