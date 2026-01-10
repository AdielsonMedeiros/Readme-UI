import React from 'react';

export interface GoodreadsCardProps {
  coverUrl?: string; // Book cover image URL
  title?: string;
  author?: string;
  progress?: number; // 0 to 100
  totalPage?: number;
  currentPage?: number;
  theme?: 'dark' | 'light';
}

export const GoodreadsCard: React.FC<GoodreadsCardProps> = ({
  coverUrl = "https://placehold.co/100x150/png", // Reliable placeholder
  title = "The Pragmatic Programmer",
  author = "Andy Hunt",
  progress = 42,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#2b1a13' : '#f4ecd8'; // book-ish warm dark/light tones
  const textColor = isDark ? '#eaddcf' : '#4a3b32';
  const accentColor = isDark ? '#d4a373' : '#a05e2b';
  const secondaryText = isDark ? '#a89080' : '#8c7b70';

  return (
    <div style={{
      display: 'flex',
      width: '100%',
      height: '100%',
      backgroundColor: bgColor,
      borderRadius: '12px',
      fontFamily: 'Georgia, serif',
      boxSizing: 'border-box',
      overflow: 'hidden',
      position: 'relative',
      filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))'
    }}>
        {/* Background Texture/Gradient */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: `linear-gradient(135deg, ${bgColor} 0%, ${isDark ? '#1a0f0a' : '#e6dabb'} 100%)`, zIndex: 0 }} />

        <div style={{ display: 'flex', padding: '24px', width: '100%', zIndex: 1, alignItems: 'center' }}>
            {/* Book Cover */}
            <div style={{ 
                width: '100px', 
                height: '150px', 
                borderRadius: '4px', 
                overflow: 'hidden', 
                boxShadow: '0 8px 16px rgba(0,0,0,0.3)', 
                marginRight: '24px',
                backgroundColor: '#333',
                flexShrink: 0,
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <img src={coverUrl} width={100} height={150} style={{ objectFit: 'cover' }} /> 
            </div>

            {/* Info */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
                <span style={{ fontSize: '10px', color: accentColor, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px', fontWeight: 'bold' }}>
                    Currently Reading
                </span>
                
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: textColor, lineHeight: '1.2', marginBottom: '6px' }}>
                    {title}
                </span>
                
                <span style={{ fontSize: '14px', color: secondaryText, fontStyle: 'italic', marginBottom: '20px' }}>
                    by {author}
                </span>

                {/* Progress Bar */}
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                         <span style={{ fontSize: '12px', fontWeight: 'bold', color: textColor }}>{progress}%</span>
                         <span style={{ fontSize: '12px', color: secondaryText }}>Progress</span>
                     </div>
                     <div style={{ display: 'flex', width: '100%', height: '6px', backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', borderRadius: '3px' }}>
                         <div style={{ width: `${progress}%`, height: '100%', backgroundColor: accentColor, borderRadius: '3px' }} />
                     </div>
                </div>
            </div>
        </div>
    </div>
  );
};
