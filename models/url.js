const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const urlSchema = new Schema({
    adres: {type: String, required: true},
    numer:{type: Number}
})

const urlMongo = mongoose.model("urlMongo", urlSchema);

module.exports = urlMongo