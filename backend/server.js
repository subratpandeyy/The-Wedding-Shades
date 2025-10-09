import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import Post from "./models/Post.js";

dotenv.config();

const app = express();

// CORS setup
const allowedOrigins = [
  "https://theweddingshades.vercel.app",
  "http://localhost:8080"
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
  credentials: true,
}));

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer configuration with file validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (JPEG, PNG, GIF, WebP) are allowed!"), false);
  }
};

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  fileFilter,
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Helper: upload buffer to Cloudinary
const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { 
        folder: "blog_images",
        transformation: [
          { width: 1200, height: 1200, crop: "limit" },
          { quality: "auto" }
        ]
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    stream.end(fileBuffer);
  });
};

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date().toISOString() });
});

// Upload endpoint
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload to Cloudinary
    const result = await streamUpload(req.file.buffer);

    res.status(201).json({ 
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (err) {
    console.error("Upload error:", err);
    
    // Handle specific errors
    if (err.message && err.message.includes("Only image files")) {
      return res.status(400).json({ error: err.message });
    }
    
    if (err.http_code === 413) {
      return res.status(413).json({ error: "File too large. Maximum size is 5MB." });
    }
    
    res.status(500).json({ error: "Failed to upload image. Please try again." });
  }
});

// Create post
app.post("/posts", async (req, res) => {
  try {
    const { title, content, imageUrl, category } = req.body;

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Content is required" });
    }

    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }

    const newPost = new Post({ 
      title: title.trim(), 
      content: content.trim(), 
      imageUrl, 
      category 
    });
    await newPost.save();

    res.status(201).json(newPost);
  } catch (err) {
    console.error("Post creation error:", err);

    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: "Failed to create post" });
  }
});

// Get all posts
app.get("/posts", async (req, res) => {
  try {
    const { category, limit = 50 } = req.query;
    
    const query = category ? { category } : {};
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.json(posts);
  } catch (err) {
    console.error("Fetch posts error:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// Get single post
app.get("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    
    res.json(post);
  } catch (err) {
    console.error("Fetch post error:", err);
    
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid post ID" });
    }
    
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

// Update post
app.put("/posts/:id", async (req, res) => {
  try {
    const { title, content, imageUrl, category } = req.body;
    
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, imageUrl, category },
      { new: true, runValidators: true }
    );
    
    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    
    res.json(updatedPost);
  } catch (err) {
    console.error("Update post error:", err);
    
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid post ID" });
    }
    
    res.status(500).json({ error: "Failed to update post" });
  }
});

// Delete post
app.delete("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    
    // Optionally delete image from Cloudinary
    if (post.imageUrl) {
      const publicId = post.imageUrl.split('/').pop().split('.')[0];
      try {
        await cloudinary.uploader.destroy(`blog_images/${publicId}`);
      } catch (cloudErr) {
        console.error("Failed to delete image from Cloudinary:", cloudErr);
      }
    }
    
    res.json({ message: "Post deleted successfully", post });
  } catch (err) {
    console.error("Delete post error:", err);
    
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid post ID" });
    }
    
    res.status(500).json({ error: "Failed to delete post" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ error: "File too large. Maximum size is 5MB." });
    }
    return res.status(400).json({ error: err.message });
  }
  
  res.status(500).json({ error: "Internal server error" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));