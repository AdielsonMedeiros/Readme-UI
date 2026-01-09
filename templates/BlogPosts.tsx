import React from 'react';

export interface BlogPostProps {
  username?: string;
  posts?: { title: string; date: string; url: string; coverImage?: string; views?: number }[];
  theme?: 'dark' | 'light';
}

export const BlogPosts: React.FC<BlogPostProps> = ({
  username = "Author",
  posts = [
    { title: "Understanding React Server Components in 2024", date: "Jan 12, 2025", url: "#", views: 1250 },
    { title: "My Journey into Rust Programming", date: "Jan 05, 2025", url: "#", views: 980 },
    { title: "System Design for Beginners", date: "Dec 28, 2024", url: "#", views: 2100 },
  ],
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#161b22' : '#ffffff';
  const cardBg = isDark ? '#0d1117' : '#f6f8fa';
  const borderColor = isDark ? '#30363d' : '#e1e4e8';
  const textColor = isDark ? '#c9d1d9' : '#24292f';
  const dimColor = isDark ? '#8b949e' : '#586069';

  return (
    <div style={{
      display: 'flex',
      width: '100%',
      height: '100%',
      backgroundColor: cardBg,
      border: `1px solid ${borderColor}`,
      borderRadius: '12px',
      fontFamily: 'Segoe UI, Ubuntu, sans-serif',
      padding: '20px',
      boxSizing: 'border-box',
      flexDirection: 'column'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '8px' }}>
        <div style={{ backgroundColor: textColor, color: cardBg, padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 900 }}>DEV</div>
        <span style={{ fontSize: '14px', fontWeight: 600, color: textColor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Latest from {username}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        {posts.slice(0, 3).map((post, i) => (
          <div key={i} style={{ 
              display: 'flex', 
              flexDirection: 'column',
              padding: '12px', 
              backgroundColor: bgColor, 
              borderRadius: '8px', 
              border: `1px solid ${borderColor}`,
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: textColor, marginBottom: '6px', lineHeight: '1.3' }}>
                  {post.title.length > 50 ? post.title.substring(0, 50) + '...' : post.title}
              </span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: dimColor }}>
                   <span>{post.date}</span>
                   {post.views && <span>{post.views.toLocaleString()} views</span>}
              </div>
          </div>
        ))}
      </div>
    </div>
  );
};
