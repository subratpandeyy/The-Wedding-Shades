import { useState, useEffect } from "react";
import axios from "axios";

interface Post {
  _id: number;
  title: string;
  content: string;
  imageUrl?: string;
}

export default function Blog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  const API_BASE = "https://theweddingshades.onrender.com";

  const fetchPosts = async () => {
    const { data } = await axios.get<Post[]>(`${API_BASE}/posts`);
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let imageUrl = "";

      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        
        const uploadRes = await axios.post(`${API_BASE}/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        

        imageUrl = uploadRes.data.url;
      }

      await axios.post(`${API_BASE}/posts`, { title, content, imageUrl });

      setTitle("");
      setContent("");
      setImage(null);

      fetchPosts();
    } catch (err) {
      console.error("Post creation error:", err);
      alert("Failed to create post. Check console for details.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Blog Post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="border p-2 rounded"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          className="border p-2 rounded"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
        <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
          Publish
        </button>
      </form>

      <h2 className="text-xl font-semibold mt-8">Blog Posts</h2>
      {posts.length === 0 && <p>No posts yet.</p>}
      {posts.map((p) => (
        <div key={p._id} className="border rounded p-4 mt-4 shadow">
          <h3 className="font-bold">{p.title}</h3>
          <p>{p.content}</p>
          {p.imageUrl && (
            <img src={p.imageUrl} alt="" className="mt-2 rounded max-h-64" />
          )}
        </div>
      ))}
    </div>
  );
}
