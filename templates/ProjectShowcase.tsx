import React from 'react';

export interface ProjectShowcaseProps {
  name?: string;
  description?: string;
  stars?: number;
  forks?: number;
  language?: string;
  languageColor?: string;
  theme?: 'dark' | 'light';
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({
  name = "my-awesome-project",
  description = "A fantastic open source project that does amazing things",
  stars = 128,
  forks = 32,
  language = "TypeScript",
  languageColor = "#3178c6",
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#0d1117' : '#ffffff';
  const textColor = isDark ? '#e6edf3' : '#24292f';
  const secondaryText = isDark ? '#8b949e' : '#586069';
  const borderColor = isDark ? '#30363d' : '#e1e4e8';

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
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          padding: '24px',
          backgroundColor: isDark ? '#161b22' : '#f6f8fa',
          border: `1px solid ${borderColor}`,
          borderRadius: '12px',
          boxShadow: isDark 
            ? '0 8px 24px rgba(0,0,0,0.4)' 
            : '0 8px 24px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          {/* Repo Icon */}
          <svg width="20" height="20" viewBox="0 0 16 16" fill={secondaryText}>
            <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"/>
          </svg>
          <span style={{ fontSize: '18px', fontWeight: 600, color: isDark ? '#58a6ff' : '#0969da' }}>
            {name}
          </span>
        </div>

        {/* Description */}
        <div style={{
          display: 'flex',
          fontSize: '14px',
          color: secondaryText,
          marginBottom: '20px',
          lineHeight: 1.5,
        }}>
          {description}
        </div>

        {/* Stats Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {/* Language */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: languageColor,
            }} />
            <span style={{ fontSize: '12px', color: secondaryText }}>{language}</span>
          </div>

          {/* Stars */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill={secondaryText}>
              <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/>
            </svg>
            <span style={{ fontSize: '12px', color: secondaryText }}>{stars}</span>
          </div>

          {/* Forks */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill={secondaryText}>
              <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/>
            </svg>
            <span style={{ fontSize: '12px', color: secondaryText }}>{forks}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
