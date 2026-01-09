import React from 'react';

export interface TechStackProps {
  skills?: string; // Comma separated: react,typescript,docker
  theme?: 'dark' | 'light';
  title?: string;
}

export const TechStack: React.FC<TechStackProps> = ({
  skills = "react,typescript,nextdotjs,tailwindcss,nodedotjs,docker",
  theme = 'dark',
  title
}) => {
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#0d1117' : '#ffffff';
  const textColor = isDark ? '#c9d1d9' : '#24292f';
  const borderColor = isDark ? '#30363d' : '#e1e4e8';
  
  const skillList = skills.split(',').map(s => s.trim()).filter(s => s.length > 0);

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        fontFamily: 'Instrument Sans, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          padding: '32px',
          backgroundColor: bgColor,
          border: `1px solid ${borderColor}`,
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          color: textColor,
        }}
      >
        {title && (
            <div style={{ display: 'flex', fontSize: '24px', fontWeight: 700, marginBottom: '24px', width: '100%', justifyContent: 'center' }}>
            {title}
            </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
          {skillList.map((skill) => (
            <div 
                key={skill}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px',
                    backgroundColor: isDark ? '#161b22' : '#f6f8fa',
                    border: `1px solid ${borderColor}`,
                    borderRadius: '12px',
                    width: '100px',
                    height: '100px'
                }}
            >
                {/* 
                   Using simpleicons.org CDN. 
                   Satori supports remote images. 
                   We default color to 'white' or 'black' depending on theme if specific color not requested, 
                   but simpleicons default colors are usually best.
                */}
                <img 
                    src={`https://cdn.simpleicons.org/${skill}`} 
                    width={48} 
                    height={48} 
                    alt={skill}
                />
                <span style={{ marginTop: '12px', fontSize: '12px', fontWeight: 500, textTransform: 'capitalize', color: isDark ? '#8b949e' : '#586069' }}>
                    {skill.replace('dot', '.')}
                </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
