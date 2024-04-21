const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    commenter: {type: Schema.Types.ObjectId, ref: "Commenter", required: true},
    text: {type: String, required: true},
    date_posted: {type: Date, required: true},
    blog_post: {type: Schema.Types.ObjectId, ref: "Blogpost", required: true}
});

module.exports = mongoose.model("Comment", CommentSchema);