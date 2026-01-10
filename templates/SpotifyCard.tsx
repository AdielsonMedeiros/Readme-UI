import React from 'react';

export interface SpotifyCardProps {
  title?: string;
  artist?: string;
  coverUrl?: string;
  progress?: number;
  status?: string;
  theme?: 'dark' | 'light';
  duration?: number;
  width?: number;
  height?: number;
}

export const SpotifyCard: React.FC<SpotifyCardProps> = ({
  title = "Never Gonna Give You Up",
  artist = "Rick Astley",
  coverUrl,
  progress = 33,
  status = "Listening on Spotify",
  theme = 'dark',
  duration = 210,
  width,
  height
}) => {
  const isCompact = width ? width < 250 : false;
  const containerPadding = isCompact ? 8 : 12;
  const gap = isCompact ? 8 : 12;
  
  // Responsive calculations
  const availableHeight = (height || 135) - (containerPadding * 2);
  const availableWidth = (width || 460) - (containerPadding * 2);
  
  // Image size logic
  // If compact, scale image down to fit alongside text (e.g. 35% of width or height), but min 20px.
  // Standard mode: cap at 100px.
  const maxImgSize = isCompact 
    ? Math.min(availableWidth * 0.4, availableHeight) 
    : 100;
    
  // Ensure image isn't too huge in tiny widgets but big enough to be seen
  const imgSize = Math.max(20, Math.min(maxImgSize, availableHeight));

  const isDark = theme === 'dark';
  
  // Calculate time strings
  const currentSeconds = Math.floor((progress / 100) * duration);
  const currentMin = Math.floor(currentSeconds / 60);
  const currentSec = currentSeconds % 60;
  const totalMin = Math.floor(duration / 60);
  const totalSec = duration % 60;
  
  const formatTime = (min: number, sec: number) => `${min}:${sec.toString().padStart(2, '0')}`;
  
  // Dynamic Styles
  const bgGradient = isDark 
    ? 'linear-gradient(145deg, #0d0d0d 0%, #1a1a2e 50%, #16213e 100%)' 
    : 'linear-gradient(145deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%)';
    
  const cardBg = isDark 
    ? 'rgba(0, 0, 0, 0.4)' 
    : 'rgba(255, 255, 255, 0.85)';
    
  const cardBorder = isDark 
    ? 'rgba(255, 255, 255, 0.08)' 
    : 'rgba(0, 0, 0, 0.08)';
    
  const textColor = isDark ? '#ffffff' : '#191414';
  const subTextColor = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(25,20,20,0.7)';
  const metaColor = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(25,20,20,0.4)';
  const progressBg = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
  
  // Spotify Green
  const spotifyGreen = '#1DB954';

  const hasCover = coverUrl && coverUrl.startsWith('data:');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: '100%',
        padding: `${containerPadding}px`,
        gap: `${gap}px`,
        background: bgGradient,
        border: `1px solid ${cardBorder}`,
        borderRadius: '8px',
        color: textColor,
        fontFamily: 'Instrument Sans, sans-serif',
        overflow: 'hidden'
      }}
    >
        {/* Album Art */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          height: `${imgSize}px`,
          width: `${imgSize}px`,
          maxHeight: '100%',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          flexShrink: 0,
          backgroundColor: spotifyGreen,
        }}>
          {hasCover ? (
            <img
              src={coverUrl}
              alt="Album Art"
              style={{
                objectFit: 'cover',
                width: '100%',
                height: '100%',
              }}
            />
          ) : (
            <svg width="50" height="50" viewBox="0 0 24 24" fill="white">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          )}
        </div>
        
        {/* Track Info */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          flex: 1, 
          gap: isCompact ? '2px' : '4px', 
          minWidth: 0,
          justifyContent: 'center' 
        }}>
          {/* Status with Spotify Icon */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '6px',
            marginBottom: '2px'
          }}>
            {/* Spotify Icon */}
            <svg width={isCompact ? "10" : "14"} height={isCompact ? "10" : "14"} viewBox="0 0 24 24" fill={spotifyGreen}>
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <span style={{ 
                fontSize: isCompact ? '8px' : '10px', 
                color: spotifyGreen, 
                fontWeight: 600, 
                letterSpacing: '0.5px', 
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }}>
              {status}
            </span>
          </div>
          
          {/* Title */}
          <div style={{ 
            fontSize: isCompact ? '12px' : '18px', 
            fontWeight: 700, 
            color: textColor, 
            lineHeight: 1.2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {title}
          </div>
          
          {/* Artist */}
          <div style={{ 
            fontSize: isCompact ? '10px' : '13px', 
            color: subTextColor, 
            marginBottom: isCompact ? '6px' : '12px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {artist}
          </div>
           
          {/* Progress Bar */}
          <div style={{ 
            display: 'flex', 
            width: '100%', 
            height: '4px', 
            backgroundColor: progressBg, 
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              display: 'flex', 
              width: `${progress}%`, 
              height: '100%', 
              backgroundColor: spotifyGreen, 
              borderRadius: '4px',
            }} />
          </div>
          
          {/* Time */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            marginTop: '6px', 
            fontSize: '10px', 
            color: metaColor,
            fontWeight: 500
          }}>
            <span>{formatTime(currentMin, currentSec)}</span>
            <span>{formatTime(totalMin, totalSec)}</span>
          </div>
        </div>
    </div>
  );
};
