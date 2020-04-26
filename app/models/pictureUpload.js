var mongoose = require('mongoose');
const Schema = mongoose.Schema;
// ==================================
// FAMILY MODEL
// ==================================
const Comment = new Schema({
  CommentPosterId: Schema.Types.ObjectId,
  commentPosterEmail: String,
  CommentPost: String
})
const PictureSchema = new Schema({
  userEmail: {
    type: String,
    required: true
  },
  posterId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  caption: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    required: true
  },
  imgPath: {
    type: String,
    required: true
  },
  comments: [Comment]
});
//Name of my Model is Family.  In the quotes is the name of the collection
// //and the collection will be modeled after my FamilySchema
const PictureUploads = mongoose.model('pictureUpload', PictureSchema);
// module.exports = mongoose.model('pictureUpload', PictureSchema);
// Here I am exporting the Model to acsess in other files
module.exports = PictureUploads;
