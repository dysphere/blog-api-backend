const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BlogpostSchema = new Schema({
    author: {type: Schema.Types.ObjectId, ref: "User", required: true},
    title: {type: String, required: true},
    content: {type: String, required: true},
    tag: {type: String, required: true},
    date_posted: {type: Date, required: true},
    published: {type: Boolean, required: true}
});

module.exports = mongoose.model("Blogpost", BlogpostSchema);