const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommenterSchema = new Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true}
})

module.exports = mongoose.model("Commenter", CommenterSchema);