import React from 'react';

export interface TechStackProps {
  skills?: string; // Comma separated: react,typescript,docker
  theme?: 'dark' | 'light';
  title?: string;
  width?: number;
  height?: number;
  animated?: boolean;
}

export const TechStack: React.FC<TechStackProps> = ({
  skills = "react,typescript,nextdotjs,tailwindcss,nodedotjs,docker",
  theme = 'dark',
  title,
  width,
  height,
  animated = true
}) => {
  const isTiny = (width && width < 300) || (height && height < 150);
  const isSmall = !isTiny && ((width && width < 500) || (height && height < 300));
  
  const containerPadding = isTiny ? 8 : (isSmall ? 16 : 32);
  const cardSize = isTiny ? 40 : (isSmall ? 80 : 100);
  const iconSize = isTiny ? 24 : (isSmall ? 32 : 48);
  const fontSize = isTiny ? 0 : 12; // 0 effectively hides it or use display none logic
  
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
          padding: `${containerPadding}px`,
          backgroundColor: bgColor,
          border: `1px solid ${borderColor}`,
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          color: textColor,
          overflow: 'hidden'
        }}
      >
        {animated && (
            <style>
            {`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .icon-fade {
                    opacity: 0;
                    animation: fadeIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                }
            `}
            </style>
        )}
        {title && !isTiny && (
            <div style={{ display: 'flex', fontSize: isSmall ? '18px' : '24px', fontWeight: 700, marginBottom: isSmall ? '12px' : '24px', width: '100%', justifyContent: 'center' }}>
            {title}
            </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
          {skillList.map((skill, index) => {
            const delay = index * 100;
            return (
            <div 
                key={skill}
                className={animated ? "icon-fade" : ""}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: isTiny ? '4px' : '16px',
                    backgroundColor: isDark ? '#161b22' : '#f6f8fa',
                    border: `1px solid ${borderColor}`,
                    borderRadius: isTiny ? '8px' : '12px',
                    width: `${cardSize}px`,
                    height: `${cardSize}px`,
                    animationDelay: animated ? `${delay}ms` : undefined
                }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                    src={`https://cdn.simpleicons.org/${skill}`} 
                    width={iconSize} 
                    height={iconSize} 
                    alt={skill}
                />
                {!isTiny && (
                    <span style={{ marginTop: isSmall ? '8px' : '12px', fontSize: `${fontSize}px`, fontWeight: 500, textTransform: 'capitalize', color: isDark ? '#8b949e' : '#586069' }}>
                        {skill.replace('dot', '.')}
                    </span>
                )}
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
