const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const LikeSchema = new Schema({
    comment: {type: Schema.Types.ObjectId, ref: "Comment", required: true},
    users: [{type: Schema.Types.ObjectId, ref: "Commenter"}]
});

module.exports = mongoose.model("Like", LikeSchema);