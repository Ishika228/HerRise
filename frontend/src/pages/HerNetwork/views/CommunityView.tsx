import React, { useState } from 'react';
import { Heart, MessageSquare, Send, Plus } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface CommunityViewProps {
  posts: any[];
  onAddPost: (content: string, category: string) => void;
  onLike: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
}

const CATEGORIES = [
  'Career Growth',
  'Entrepreneurship',
  'Financial Learning',
  'Motivation',
  'General Discussion',
];

const CATEGORY_COLORS: Record<string, string> = {
  'Career Growth': 'bg-blue-100 text-blue-700',
  'Entrepreneurship': 'bg-purple-100 text-purple-700',
  'Financial Learning': 'bg-emerald-100 text-emerald-700',
  'Motivation': 'bg-pink-100 text-pink-700',
  'General Discussion': 'bg-gray-100 text-gray-700',
};

export const CommunityView: React.FC<CommunityViewProps> = ({
  posts,
  onAddPost,
  onLike,
  onComment,
}) => {
  const { user } = useAuth();

  // Create post state
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState('General Discussion');

  // Filter state
  const [activeFilter, setActiveFilter] = useState<string>('All');

  // Per-post comment inputs
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handlePost = () => {
    if (!postContent.trim()) return;
    onAddPost(postContent.trim(), postCategory);
    setPostContent('');
    setPostCategory('General Discussion');
  };

  const handleComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    onComment(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const filteredPosts =
    activeFilter === 'All'
      ? posts
      : posts.filter((p) => p.category === activeFilter);

  const avatarFallback = (name: string) =>
    name
      ?.split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?';

  return (
    <div className="min-h-screen bg-[#faf9fd]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">
          Women's Community
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          A safe, supportive space to share experiences, seek advice, and uplift each other.
        </p>
      </div>

      <div className="flex gap-6">
        {/* LEFT COLUMN */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Create Post Card */}
          <div className="bg-white rounded-3xl border border-purple-100 shadow-xs p-5">
            <div className="flex gap-3 items-start">
              {/* User Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4A154B] to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  avatarFallback(user?.name || 'U')
                )}
              </div>

              <div className="flex-1 space-y-3">
                <textarea
                  className="w-full text-xs text-gray-800 bg-[#faf9fd] rounded-2xl border border-purple-100 p-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-200 placeholder:text-gray-400 leading-relaxed"
                  rows={3}
                  placeholder="Share something with the community…"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                />

                <div className="flex items-center gap-3">
                  <select
                    className="text-xs border border-purple-100 rounded-xl px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-200 cursor-pointer"
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value)}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handlePost}
                    disabled={!postContent.trim()}
                    className="ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#4A154B] hover:bg-[#350c36] text-white text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Feed */}
          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-purple-100 shadow-xs p-8 text-center">
              <p className="text-sm text-gray-400">No posts in this category yet. Be the first to share!</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-3xl border border-purple-100 shadow-xs p-5 space-y-3"
              >
                {/* Author row */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-purple-100">
                    {post.authorAvatar ? (
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#4A154B] to-pink-500 text-white text-xs font-bold">
                        {avatarFallback(post.authorName)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-gray-900 leading-tight truncate">
                      {post.authorName}
                    </p>
                    <p className="text-[10px] text-gray-500 leading-tight">
                      {post.authorRole} · {post.timeAgo}
                    </p>
                  </div>

                  {/* Category badge */}
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                      CATEGORY_COLORS[post.category] || 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {post.category}
                  </span>
                </div>

                {/* Content */}
                <p className="text-xs text-gray-800 leading-relaxed">
                  {post.content}
                </p>

                {/* Action Bar */}
                <div className="flex items-center gap-4 pt-1 border-t border-purple-50">
                  <button
                    onClick={() => onLike(post.id)}
                    className="flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-pink-600 transition-colors cursor-pointer"
                  >
                    <Heart
                      className="w-4 h-4"
                      fill={post.isLiked ? '#be185d' : 'none'}
                      stroke={post.isLiked ? '#be185d' : 'currentColor'}
                    />
                    <span className={post.isLiked ? 'text-pink-600 font-semibold' : ''}>
                      {post.likes}
                    </span>
                  </button>

                  <button className="flex items-center gap-1.5 text-[11px] text-gray-500 cursor-default">
                    <MessageSquare className="w-4 h-4" />
                    {post.comments?.length || 0}
                  </button>
                </div>

                {/* Comments List */}
                {post.comments && post.comments.length > 0 && (
                  <div className="bg-[#faf9fd] rounded-2xl p-3 space-y-2.5">
                    {post.comments.map((comment: any) => (
                      <div key={comment.id} className="flex gap-2 items-start">
                        <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 bg-purple-100">
                          {comment.authorAvatar ? (
                            <img
                              src={comment.authorAvatar}
                              alt={comment.authorName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#4A154B] to-pink-400 text-white text-[9px] font-bold">
                              {avatarFallback(comment.authorName)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-gray-800 leading-tight">
                            {comment.authorName}
                            <span className="font-normal text-gray-400 ml-1">
                              · {comment.timeAgo}
                            </span>
                          </p>
                          <p className="text-[11px] text-gray-700 leading-relaxed mt-0.5">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment Input */}
                <div className="flex gap-2 items-center">
                  <div className="w-7 h-7 rounded-full flex-shrink-0 bg-gradient-to-br from-[#4A154B] to-pink-500 flex items-center justify-center text-white text-[9px] font-bold">
                    {avatarFallback(user?.name || 'U')}
                  </div>
                  <input
                    type="text"
                    placeholder="Write a reply…"
                    value={commentInputs[post.id] || ''}
                    onChange={(e) =>
                      setCommentInputs((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleComment(post.id);
                    }}
                    className="flex-1 text-xs bg-[#faf9fd] border border-purple-100 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-200 placeholder:text-gray-400"
                  />
                  <button
                    onClick={() => handleComment(post.id)}
                    disabled={!commentInputs[post.id]?.trim()}
                    className="p-1.5 rounded-xl bg-[#4A154B] hover:bg-[#350c36] text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* RIGHT COLUMN — desktop only */}
        <div className="hidden lg:flex flex-col gap-4 w-64 flex-shrink-0">
          {/* Category Filter Pills */}
          <div className="bg-white rounded-3xl border border-purple-100 shadow-xs p-4 space-y-2">
            <p className="text-xs font-bold text-gray-700 mb-3">Filter by Category</p>
            {['All', ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`w-full text-left text-xs px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                  activeFilter === cat
                    ? 'bg-[#4A154B] text-white'
                    : 'bg-[#faf9fd] text-gray-600 hover:bg-purple-50 hover:text-[#4A154B]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Community Guidelines */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl border border-purple-100 shadow-xs p-4">
            <p className="text-xs font-bold text-[#4A154B] mb-2">📋 Community Guidelines</p>
            <ul className="text-[11px] text-gray-600 space-y-1.5 leading-relaxed">
              <li>✦ Be respectful and kind</li>
              <li>✦ Share authentic experiences</li>
              <li>✦ No promotional content</li>
              <li>✦ Support each other's growth</li>
              <li>✦ Keep discussions constructive</li>
              <li>✦ Protect everyone's privacy</li>
            </ul>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-3xl border border-purple-100 shadow-xs p-4">
            <p className="text-xs font-bold text-gray-700 mb-3">📊 Community Stats</p>
            <div className="space-y-2">
              {[
                { label: 'Total Members', value: '2,847' },
                { label: 'Posts This Week', value: `${posts.length + 12}` },
                { label: 'Active Today', value: '134' },
                { label: 'Mentors Online', value: '8' },
              ].map((stat) => (
                <div key={stat.label} className="flex justify-between items-center">
                  <span className="text-[11px] text-gray-500">{stat.label}</span>
                  <span className="text-[11px] font-bold text-[#4A154B]">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityView;
