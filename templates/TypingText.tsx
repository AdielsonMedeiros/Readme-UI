import React from 'react';

export interface TypingTextProps {
  lines?: string;
  theme?: 'dark' | 'light';
}

export const TypingText: React.FC<TypingTextProps> = ({
  lines = "Full Stack Developer|Open Source Enthusiast|Coffee Lover",
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#0d1117' : '#ffffff';
  const textColor = isDark ? '#e6edf3' : '#24292f';
  const accentColor = isDark ? '#58a6ff' : '#0969da';
  const cursorColor = isDark ? '#1db954' : '#2ea043';

  const lineArray = lines.split('|').map(l => l.trim());

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bgColor,
        fontFamily: 'Instrument Sans, sans-serif',
        padding: '24px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        {lineArray.map((line, index) => (
          <div 
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{
              fontSize: index === 0 ? '28px' : '20px',
              fontWeight: index === 0 ? 700 : 500,
              color: index === 0 ? textColor : accentColor,
            }}>
              {line}
            </span>
            {index === lineArray.length - 1 && (
              <span style={{
                width: '3px',
                height: index === 0 ? '32px' : '24px',
                backgroundColor: cursorColor,
                display: 'flex',
              }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
