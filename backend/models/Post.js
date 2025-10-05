import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String },
  category: { 
    type: String, 
    required: true,
    enum: ["Wedding", "Portraits", "Events", "Products"] // allowed categories
  }
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

export default Post;
