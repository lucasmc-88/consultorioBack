const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const specialtyShema = new Schema ({
    name: { type: String, required: true}
});

module.exports = mongoose.model('Specialty', specialtyShema);