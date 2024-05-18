const { DateTime } = require("luxon");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    commenter: {type: Schema.Types.ObjectId, ref: "User", required: true},
    text: {type: String, required: true},
    date_posted: {type: Date, required: true},
    blog_post: {type: Schema.Types.ObjectId, ref: "Blogpost", required: true},
    liked: [{type: Schema.Types.ObjectId, ref: "User"}]
});

CommentSchema.virtual("date_posted_formatted").get(function() {
    return DateTime.fromJSDate(this.date_posted).toLocaleString(DateTime.DATE_MED);
});

CommentSchema.set('toJSON', {
    virtuals: true,
  });


module.exports = mongoose.model("Comment", CommentSchema);