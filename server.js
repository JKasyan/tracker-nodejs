/**
 *
 */
var port = process.env.PORT || 9000;
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var config = require('./config');
var jwt    = require('jsonwebtoken');
var moment = require('moment');
var redis = require('redis');
var redisPort = process.env.REDIS_PORT;
var redisHost = process.env.REDIS_HOST;
var pass = process.env.REDIS_PASS;
var clientRedis = redis.createClient(redisPort, redisHost);
var MONGODB_URI = process.env.MONGODB_URI;
//
var app = express();
//
var PointModel = require('./models/point').PointModel;
var User = require('./models/user').UserModel;
mongoose.connect(MONGODB_URI);
clientRedis.auth(pass, function(err) {
    if (err) throw err;
    console.log('Success connected to redis!');
});
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

/*apiRoutes.use(function (request, response, next) {
    var token = request.body.token || request.query.token || request.headers['x-access-control'];
    if (token) {
        jwt.verify(token, app.get('superSecretKey'), function (err, decoded) {
            if (err) {
                return response.json({success: false, message: 'Failed to authenticate token'});
            }
            console.log('decoded = ', decoded);
            clientRedis.hgetall(decoded.email, function (err, userAuthData) {
                if (err) throw err;
                console.log('user auth data = ', userAuthData);
                var now = moment();
                if (userAuthData
                    && userAuthData.password
                    && userAuthData.password == decoded.password
                    && userAuthData.expired
                    && userAuthData.expired > now) {
                    request.decoded = decoded;
                    next();
                } else {
                    return response.status(403).json({success: false, message: 'Not authorized'});
                }
            });
        });
    } else {
        return response.status(403).send({success: false, message: 'Not authorized'});
    }
});*/

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

apiRoutes.get('/points/q=:quantity', function (request, response) {
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

apiRoutes.get('/users', function (request, response) {
    User.find({}, function (error, users) {
        if(error) throw new Error;
        response.json(users);
    })
});

app.post('/authenticate', function(request, response) {
    var email = request.body.email;
    var pass = request.body.password;
    console.log('email = ', email, ', pass = ', pass);
    User.findOne({email: email}, function(error, user) {
        if (error) throw error;
        if(!user) {
            response.json({success:false, message:'Authentication failed'})
        } else {
            console.log('user = ', user);
            user.comparePassword(pass, function(err, isMatch) {
                if(err) throw err;
                console.log('isMatch = ', isMatch);
                if(isMatch) {
                    var expired = moment().add(60, 'minutes').valueOf();
                    var expression = {
                        email: user.email,
                        password: user.password,
                        expired: expired
                    }
                    var token = jwt.sign(expression, app.get('superSecretKey'));
                    var authData = [user.email];
                    for(var key in expression) {
                        authData.push(key);
                        authData.push(expression[key]);
                    }
                    clientRedis.hmset(authData, function(err, result) {
                        if(err) throw err;
                        console.log('Saved auth data in redis: ', result);
                        response.json(
                            {
                                success: true,
                                token: token,
                                message:'Success authentication',
                                expired: expired,
                                roles: user.roles
                            }
                        );
                    });
                } else {
                    response.json({success: false, message:'Incorrect password'});
                }
            });
        }
    });
});

app.use('/api', apiRoutes);

app.listen(port, function () {
    console.log('Express server listening on port  = ' + port + '!')
});
