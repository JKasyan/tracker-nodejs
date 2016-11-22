/**
 * Created by 1 on 11/22/2016.
 */
var mongoose = require('mongoose');

var User = new mongoose.Schema({
    id:String,
    firstName:String,
    secondName:String,
    email:String,
    enabled:Boolean,
    gadgetIds:Array
}, {collection: 'User', versionKey: false});

var UserModel = mongoose.model('User', User);
module.exports.UserModel = UserModel;