import React from 'react';

export interface SpotifyCardProps {
  title?: string;
  artist?: string;
  coverUrl?: string;
  progress?: number;
  status?: string;
  theme?: 'dark' | 'light';
}

export const SpotifyCard: React.FC<SpotifyCardProps> = ({
  title = "Never Gonna Give You Up",
  artist = "Rick Astley",
  coverUrl = "https://i.scdn.co/image/ab67616d0000b2735755e164993d98a38ae57aa1",
  progress = 33,
  status = "Listening on Spotify",
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';
  
  // Dynamic Styles
  const bgGradient = isDark 
    ? 'linear-gradient(135deg, #111111 0%, #1DB954 100%)' 
    : 'linear-gradient(135deg, #f5f5f5 0%, #a8e6cf 100%)';
    
  const cardBg = isDark 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(255, 255, 255, 0.6)';
    
  const cardBorder = isDark 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(255, 255, 255, 0.4)';
    
  const textColor = isDark ? '#fff' : '#111';
  const subTextColor = isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)';
  const metaColor = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
  const progressBg = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        background: bgGradient,
        fontFamily: 'Instrument Sans',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '500px',
          padding: '24px',
          gap: '24px',
          backgroundColor: cardBg,
          border: `1px solid ${cardBorder}`,
          borderRadius: '24px',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
          color: textColor,
        }}
      >
        <img
            src={coverUrl}
            alt="Album Art"
            width={120}
            height={120}
            style={{
                borderRadius: '16px',
                objectFit: 'cover',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
        />
        
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '4px' }}>
             <div style={{ display: 'flex', fontSize: '12px', color: '#1DB954', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
                <span style={{ marginRight: '8px' }}>♫</span> {status}
             </div>
             <div style={{ display: 'flex', fontSize: '24px', fontWeight: 700, color: textColor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {title}
             </div>
             <div style={{ display: 'flex', fontSize: '18px', color: subTextColor, marginBottom: '12px' }}>
                {artist}
             </div>
             
             {/* Progress Bar */}
             <div style={{ display: 'flex', width: '100%', height: '4px', backgroundColor: progressBg, borderRadius: '2px' }}>
                <div style={{ display: 'flex', width: `${progress}%`, height: '100%', backgroundColor: '#1DB954', borderRadius: '2px' }} />
             </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '6px', fontSize: '10px', color: metaColor }}>
                <span>1:23</span>
                <span>3:45</span>
             </div>
        </div>
      </div>
    </div>
  );
};
