import React, { useState } from 'react';
import { BookOpen, Clock, ArrowUpRight, X } from 'lucide-react';
import Markdown from 'react-markdown';
import { BlogPost } from '../../types';

interface BlogSectionProps {
  blogPosts: BlogPost[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({ blogPosts }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <section id="blog" className="py-20 bg-[#050505] text-[#e0e0e0] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-12 border-b border-white/10 gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-green-400 font-semibold">INDEX 04 · TECHNICAL WRITINGS</span>
            </div>
            <h2 className="font-display font-medium text-3xl sm:text-5xl text-white tracking-tight">
              Articles & Systems Notes
            </h2>
          </div>

          <p className="text-white/50 max-w-md text-base leading-relaxed">
            Essays on distributed systems, storage internals, low-latency API design, and practical engineering architecture.
          </p>
        </div>

        {/* Blog Posts Ledger List */}
        {blogPosts.length === 0 ? (
          <p className="text-white/40 font-mono text-sm">No articles published yet.</p>
        ) : (
          <div className="space-y-8">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8 bg-[#080808] rounded-xl border border-white/10 hover:border-white/30 transition-all cursor-pointer group shadow-sm"
              >
                {/* Date & Read Time */}
                <div className="md:col-span-3 space-y-1">
                  <span className="text-xs font-mono text-white/80 font-bold block">{post.publishedAt}</span>
                  <span className="text-[10px] uppercase font-mono text-white/40 flex items-center">
                    <Clock className="w-3 h-3 mr-1 inline" />
                    {post.readTime}
                  </span>
                </div>

                {/* Content Summary */}
                <div className="md:col-span-9 space-y-3">
                  <h3 className="font-display font-medium text-2xl text-white group-hover:text-white/80 transition-colors flex items-center justify-between">
                    <span>{post.title}</span>
                    <ArrowUpRight className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>

                  <p className="text-white/60 text-base leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] uppercase tracking-wider font-mono text-white/70 bg-white/5 px-2.5 py-0.5 rounded-sm border border-white/10"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Blog Post Full Markdown Modal */}
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md overflow-y-auto">
            <div 
              className="relative w-full max-w-3xl bg-[#080808] text-white rounded-xl shadow-2xl border border-white/10 overflow-hidden max-h-[90vh] flex flex-col my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 bg-[#0a0a0a] text-white flex items-center justify-between border-b border-white/10 shrink-0">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-mono text-green-400">{selectedPost.publishedAt} · {selectedPost.readTime}</span>
                  <h3 className="font-display font-medium text-2xl text-white mt-1">
                    {selectedPost.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cover Image if available */}
              {selectedPost.coverImage && (
                <div className="w-full h-48 sm:h-64 overflow-hidden bg-black/40 shrink-0 border-b border-white/10">
                  <img
                    src={selectedPost.coverImage}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover opacity-90"
                  />
                </div>
              )}

              {/* Body Content */}
              <div className="p-6 sm:p-10 overflow-y-auto space-y-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedPost.tags.map((tag) => (
                    <span key={tag} className="text-[10px] uppercase tracking-widest font-mono text-white bg-white/10 px-2.5 py-1 rounded-sm border border-white/10">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="prose prose-invert max-w-none text-white/80 space-y-4 font-sans leading-relaxed text-lg">
                  <Markdown>{selectedPost.body}</Markdown>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-[#0a0a0a] border-t border-white/10 flex justify-end shrink-0">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="px-5 py-2 rounded-sm bg-white hover:bg-neutral-200 text-black font-sans font-bold text-xs uppercase tracking-widest transition-colors"
                >
                  CLOSE ARTICLE
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
