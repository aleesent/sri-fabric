import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types/index.ts';
import { ArrowLeft, Calendar, User, Tag, ArrowRight } from 'lucide-react';

interface BlogViewProps {
  initialSlug?: string;
  onNavigate: (path: string) => void;
}

export const BlogView: React.FC<BlogViewProps> = ({ initialSlug, onNavigate }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPosts(data);
          if (initialSlug) {
            const found = data.find((p) => p.slug === initialSlug);
            if (found) setSelectedPost(found);
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [initialSlug]);

  if (selectedPost) {
    return (
      <div className="bg-[#faf7f2] min-h-screen py-10 px-4 sm:px-8">
        <article className="max-w-3xl mx-auto space-y-8">
          <button
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-1.5 text-xs text-[#4a1122] font-semibold hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </button>

          <div className="space-y-4">
            <span className="px-2.5 py-0.5 bg-[#4a1122] text-[#f7eedf] text-[10px] font-bold uppercase tracking-wider rounded">
              {selectedPost.categoryName || 'FABRIC INSIGHTS'}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 leading-tight">
              {selectedPost.title}
            </h1>
            <div className="flex items-center gap-4 text-xs text-stone-500 pt-1">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#dfb15b]" />
                <span>{selectedPost.author}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#dfb15b]" />
                <span>{new Date(selectedPost.publishDate).toLocaleDateString()}</span>
              </span>
            </div>
          </div>

          <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#24060d] border border-stone-200 shadow-md">
            <img
              src={selectedPost.featuredImageUrl}
              alt={selectedPost.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose prose-stone max-w-none text-sm text-stone-700 leading-relaxed space-y-4 whitespace-pre-line font-serif text-base sm:text-lg">
            {selectedPost.content}
          </div>

          {selectedPost.tags && (
            <div className="pt-6 border-t border-stone-200 flex items-center gap-2 text-xs text-stone-500">
              <Tag className="w-4 h-4 text-[#dfb15b]" />
              <span>Tags: {selectedPost.tags}</span>
            </div>
          )}
        </article>
      </div>
    );
  }

  return (
    <div className="bg-[#faf7f2] min-h-screen py-10 px-4 sm:px-8 space-y-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="border-b border-stone-300 pb-6">
          <span className="text-xs uppercase tracking-[0.25em] text-[#4a1122] font-semibold">
            EDITORIAL & PERSPECTIVES
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
            Latest From Our Blog & Textile Insights
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
            Technical analysis, trend forecasts, historical craft perspectives, and factory updates from the master weavers and textile directors at SRI Fabrics.
          </p>
        </div>

        {/* Blog Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="group bg-white rounded-lg overflow-hidden border border-stone-200/90 shadow-sm hover:border-[#dfb15b] hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#24060d]">
                <img
                  src={post.featuredImageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-[#4a1122] text-[#f7eedf] text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded">
                  {post.categoryName || 'FABRICS'}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900 group-hover:text-[#4a1122] transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-3 mt-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-[#4a1122] font-semibold">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
