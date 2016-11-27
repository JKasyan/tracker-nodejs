/**
 * Created by kasyan on 11/24/16.
 */
var jwt = require('jsonwebtoken');
var moment = require('moment');

var exp = moment().add(7, 'minutes').valueOf();
console.log(new Date(exp));
var token = jwt.sign({foo: 'bar', exp: exp}, 'SECRET_KEY');
console.log(token);

jwt.verify(token, "SECRET_KEY", function(err, res) {
    if(err) throw err;
    console.log(res)
});


