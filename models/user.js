/**
 * Created by 1 on 11/22/2016.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var User = new mongoose.Schema({
    id: String,
    firstName: String,
    secondName: String,
    email: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    roles : {
        type:Array,
        required: true
    },
    enabled: Boolean,
    gadgetIds: Array
}, {collection: 'User', versionKey: false});

User.methods.comparePasswords = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
}

var UserModel = mongoose.model('User', User);
module.exports.UserModel = UserModel;