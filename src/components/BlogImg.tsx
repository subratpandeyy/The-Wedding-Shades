import axios from 'axios';
import { useEffect, useState } from 'react';
export default function BlogImg() {
    const [posts, setPosts] = useState<Post[]>([]);

    interface Post {
        _id: number;
        title: string;
        content: string;
        imageUrl?: string;
      }

    const API_BASE = "http://localhost:5000";

    const fetchPosts = async () => {
    const { data } = await axios.get<Post[]>(`${API_BASE}/posts`);
    setPosts(data);
  };
  
  useEffect(() => {
    fetchPosts();
  }, []);

  fetchPosts();

  return (
    <section id='blog' className='py-10 bg-card pattern-bg px-auto px-6'>
     <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Recent 
        <span className="text-gradient-gold font-corinthia text-6xl px-1"> Shoots</span></h2>
      {posts.length === 0 && <p>No posts yet.</p>}
      <div className='grid md:grid-cols-2 gap-8 max-w-7xl mx-auto'>
      {posts.map((p) => (
        <div key={p._id} className='py-3 flex flex-col items-center'>
          <h3 className="font-bold">{p.title}</h3>
          <p>{p.content}</p>
          {p.imageUrl && (
            <img src={p.imageUrl} alt="" className="w-full h-full object-cover rounded-2xl" />
          )}
        </div>
      ))}
      </div>
      </div>
      </div>
    </section>
  )
}
