/**
 *
 */
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var config = require('./config');
var jwt    = require('jsonwebtoken');
var MONGODB_URI = process.env.MONGODB_URI;
//
var app = express();
//
var PointModel = require('./models/point').PointModel;
mongoose.connect(MONGODB_URI);
//
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));
//
app.set('superSecretKey', config.secret);

app.get('/', function (req, res) {
    res.sendFile('index.html', {root: __dirname + '/public/views'});
});

app.get('/api/points/from=:from/to=:to', function (request, response) {
    var from = parseInt(request.params.from) / 1000;
    var to = parseInt(request.params.to) / 1000;
    console.log('from = ', from, ', to = ', to);
    PointModel.find(
        {
            timestamp: {$gt: from, $lt: to}
        },
        {'timestamp': 1, 'lat': 1, 'lng': 1, '_id': 0},
        function (err, points) {
            if (err) {
                response.statusCode = 500;
                return response.send({error: 'Server error'});
            } else {
                console.log(points.length);
                return response.json(points);
            }
        });
});

app.get('/api/points/quantity=:quantity', function (request, response) {
    var q = parseInt(request.params.quantity);
    PointModel.find(
        {},
        {'timestamp': 1, 'lat': 1, 'lng': 1, '_id': 0},
        {
            limit: q,
            sort: {
                timestamp: -1
            }
        },
        function (error, points) {
            return response.json(points);
        }
    );
});

app.listen(1337, function () {
    console.log('Express server listening on port 1337!')
});