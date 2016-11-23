/**
 * Created by 1 on 11/22/2016.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    id: String,
    firstName: String,
    secondName: String,
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    roles: {
        type: Array,
        required: true
    },
    enabled: Boolean,
    gadgetIds: Array
}, {collection: 'User', versionKey: false});

UserSchema.methods.comparePassword = function (candidatePassword, callback) {
    console.log('pass = ', this.password);
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
}

var UserModel = mongoose.model('User', UserSchema);
module.exports.UserModel = UserModel;