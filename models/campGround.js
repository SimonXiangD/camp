const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const mysteryLandSchem = new Schema({
    title: String,
    price: String,
    description: String,
    location: String,
    image: String,
});



module.exports = mongoose.model('mland', mysteryLandSchem);