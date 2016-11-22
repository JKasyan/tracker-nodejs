/**
 * Created by 1 on 11/22/2016.
 */
var mongoose = require('mongoose');

var Point = new mongoose.Schema({
    id: String,
    lat: Number,
    lng: Number,
    timestamp: Number,
    speed: Number,
    bearing: Number,
    altitude: Number,
    batt: Number,
    gadgetNumber: String
}, {collection: 'Point', versionKey: false});

var PointModel = mongoose.model('Point', Point);
module.exports.PointModel = PointModel;