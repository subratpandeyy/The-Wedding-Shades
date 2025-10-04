import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import Post from "./models/Post.js";

dotenv.config();

const app = express();

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

// Mongo db connect
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));


// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload endpoint
app.post("/upload", upload.single("image"), async (req, res) => {
    try {
      console.log("File received:", req.file);
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
  
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "blog_images" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
  
      res.json({ url: result.secure_url });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ error: err.message });
    }
  });
  
// api route
app.post("/posts", async (req, res) => {
    try {
      const { title, content, imageUrl } = req.body;
      if (!title || !content) {
        return res.status(400).json({ error: "Title and content are required" });
      }
  
      const newPost = new Post({ title, content, imageUrl });
      await newPost.save();
  
      res.json(newPost);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/posts", async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: -1 });
      res.json(posts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });
  
  const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
