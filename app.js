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
var bcrypt = require('bcrypt');
var MONGODB_URI = process.env.MONGODB_URI;
//
var app = express();
//
var PointModel = require('./models/point').PointModel;
var User = require('./models/user').UserModel;
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

var apiRoutes = express.Router();

apiRoutes.get('/points/from=:from/to=:to', function (request, response) {
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
                response.send({error: 'Server error'});
            } else {
                console.log(points.length);
                response.json(points);
            }
        });
});

apiRoutes.get('/points/quantity=:quantity', function (request, response) {
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
            response.json(points);
        }
    );
});

apiRoutes.post('/authenticate', function(request, response) {
    var email = request.query.email;
    var pass = request.query.password;
    console.log('email = ', email, ', pass = ', pass);
    User.findOne({email: email}, function(error, user) {
        if (error) throw error;
        if(!user) {
            response.json({success:false, message:'Authentication failed'})
        } else {
            console.log('password hash = ', user.password);
            //user.comparePassword('')
            /*bcrypt.compare(pass, user.firstName, function(err, result) {
                if (err) throw err;
                console.log('result = ', result);
                respone.json(result);
            });*/
            response.json({message:'ok'});
        }
    });
});

app.use('/api', apiRoutes);

app.listen(1337, function () {
    console.log('Express server listening on port 1337!')
});