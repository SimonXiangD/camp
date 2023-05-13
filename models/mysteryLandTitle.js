const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const mLandTitleSchem = new Schema({
    name: String,
});

const mLandDescription = new Schema({
    name: String,
});


const locationNameSchem = new Schema({
    name: String,
});

const imageUrlSchem = new Schema({
    name: String,
});



const locationModel = mongoose.model('locationName', locationNameSchem);
const titleModel = mongoose.model('titleName', mLandTitleSchem);
const descripModel = mongoose.model('landDescription', mLandDescription);
const imageModel = mongoose.model('imageUrl', imageUrlSchem);

module.exports = { titleModel, descripModel, locationModel, imageModel };