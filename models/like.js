const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const LikeSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "Commenter", required: true},
    comment: {type: Schema.Types.ObjectId, ref: "Comment", required: true},
    liked: {type: Boolean, required: true}  
});

module.exports = mongoose.model("Like", LikeSchema);