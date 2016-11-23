/**
 * Created by kasyan on 11/23/16.
 */
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);
var User = require('./models/user').UserModel;

User.find({}, function(err, users) {
    console.log(users[0]);
    console.log(users[0].password);
    mongoose.disconnect();
});
