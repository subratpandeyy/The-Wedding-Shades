import { useState, useEffect } from "react";
import axios from "axios";

interface Post {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  category?: string;
  createdAt: string;
}

const categories = ["Wedding", "Portraits", "Events", "Products"];

export default function Blog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_BASE = "https://theweddingshades.onrender.com";

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get<Post[]>(`${API_BASE}/posts`);
      setPosts(data);
      setError("");
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Compress image to stay under 5MB
  const compressImage = (file: File, maxSizeMB = 5): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          
          // Calculate new dimensions to keep aspect ratio
          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1920;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = (height * MAX_WIDTH) / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = (width * MAX_HEIGHT) / height;
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          // Try different quality levels until file is under maxSizeMB
          let quality = 0.9;
          
          const tryCompress = () => {
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error('Compression failed'));
                  return;
                }
                
                const sizeMB = blob.size / 1024 / 1024;
                
                // If still too large and quality can be reduced, try again
                if (sizeMB > maxSizeMB && quality > 0.1) {
                  quality -= 0.1;
                  tryCompress();
                } else {
                  // Create new File object
                  const compressedFile = new File([blob], file.name, {
                    type: 'image/jpeg',
                    lastModified: Date.now(),
                  });
                  resolve(compressedFile);
                }
              },
              'image/jpeg',
              quality
            );
          };
          
          tryCompress();
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("📸 Image selected:", {
      name: file.name,
      size: `${(file.size / 1024).toFixed(2)} KB (${(file.size / 1024 / 1024).toFixed(2)} MB)`,
      type: file.type
    });

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      setImage(null);
      e.target.value = "";
      return;
    }

    const sizeMB = file.size / 1024 / 1024;
    
    // If image is larger than 5MB, compress it
    if (sizeMB > 5) {
      setCompressing(true);
      setError("");
      
      try {
        console.log(`🗜️ Compressing image (${sizeMB.toFixed(2)}MB -> target: <5MB)...`);
        const compressedFile = await compressImage(file, 4.5); // Compress to 4.5MB to be safe
        const newSizeMB = compressedFile.size / 1024 / 1024;
        
        console.log(`✅ Compression complete: ${newSizeMB.toFixed(2)}MB`);
        setImage(compressedFile);
        setSuccess(`Image compressed from ${sizeMB.toFixed(2)}MB to ${newSizeMB.toFixed(2)}MB`);
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        console.error("Compression error:", err);
        setError("Failed to compress image. Please choose a smaller file.");
        setImage(null);
        e.target.value = "";
      } finally {
        setCompressing(false);
      }
    } else {
      setImage(file);
      setError("");
    }
  };

  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(URL.createObjectURL(image));
    };
  }, [image]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim() || !content.trim() || !category) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setUploading(true);
      let imageUrl = "";

      if (image) {
        console.log("🚀 Starting image upload to:", `${API_BASE}/upload`);
        
        const formData = new FormData();
        formData.append("image", image);

        try {
          const uploadRes = await axios.post(`${API_BASE}/upload`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total || 100)
              );
              console.log(`📊 Upload progress: ${percentCompleted}%`);
            },
          });

          console.log("✅ Upload successful:", uploadRes.data);
          imageUrl = uploadRes.data.url;
        } catch (uploadErr: any) {
          console.error("❌ Upload failed:", {
            message: uploadErr.message,
            response: uploadErr.response?.data,
            status: uploadErr.response?.status,
          });
          throw uploadErr;
        }
      }

      const newPost = {
        title: title.trim(),
        content: content.trim(),
        imageUrl,
        category,
      };

      const { data } = await axios.post(`${API_BASE}/posts`, newPost);
      console.log("✅ Post created successfully:", data);

      setPosts((prev) => [data, ...prev]);

      // Reset form
      setTitle("");
      setContent("");
      setCategory("");
      setImage(null);
      
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      setSuccess("Post created successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("❌ Post creation error:", err);
      const errorMsg =
        err.response?.data?.error || 
        err.message || 
        "Failed to create post. Please try again.";
      setError(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-3xl font-bold mb-6">Create Blog Post</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-800">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded text-green-800">
            {success}
          </div>
        )}

        {compressing && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded text-blue-800">
            🗜️ Compressing image... Please wait.
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Content *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content..."
              className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none min-h-[150px]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Image (optional, will auto-compress if larger than 5MB)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={compressing}
              className="w-full border p-2 rounded disabled:bg-gray-100"
            />

            {image && (
              <div className="mt-3">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="rounded-lg max-h-64 w-full object-cover"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {image.name} ({(image.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={uploading || compressing}
            className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed font-medium"
          >
            {uploading ? "Publishing..." : compressing ? "Compressing..." : "Publish Post"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Recent Posts</h2>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
          </div>
        ) : posts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No posts yet. Create your first post!
          </p>
        ) : (
          <div className="space-y-6">
            {posts.map((p) => (
              <article
                key={p._id}
                className="border rounded-lg p-5 hover:shadow-lg transition"
              >
                {p.category && (
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mb-3">
                    {p.category}
                  </span>
                )}

                <h3 className="text-xl font-bold mb-2">{p.title}</h3>
                <p className="text-gray-600 mb-4 whitespace-pre-wrap">
                  {p.content}
                </p>

                {p.imageUrl && (
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="rounded-lg max-h-96 w-full object-cover"
                  />
                )}

                {p.createdAt && (
                  <p className="text-sm text-gray-400 mt-3">
                    {new Date(p.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}