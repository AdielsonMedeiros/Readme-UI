import React from 'react';

export interface GithubStatsProps {
  username?: string;
  name?: string;
  stars?: number;
  followers?: number;
  repos?: number;
  forks?: number;
  avatarUrl?: string;
  theme?: 'dark' | 'light';
  location?: string;
  bio?: string;
  company?: string;
  blog?: string;
  joinedDate?: string;
  languages?: string; // JSON string
}

export const GithubStats: React.FC<GithubStatsProps> = ({
  username = "octocat",
  name = "The Octocat",
  stars = 0,
  followers = 500,
  repos = 30,
  forks = 0,
  avatarUrl = "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
  theme = 'dark',
  location,
  bio,
  company,
  blog,
  joinedDate,
  languages
}) => {
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#0d1117' : '#ffffff';
  const textColor = isDark ? '#c9d1d9' : '#24292f';
  const borderColor = isDark ? '#30363d' : '#e1e4e8';
  const secondaryText = isDark ? '#8b949e' : '#586069';

  const parsedLanguages = languages ? JSON.parse(languages) : [];
  const totalLangCount = parsedLanguages.reduce((acc: number, l: any) => acc + l.count, 0);

  // Language Colors
  const colors = ['#3178c6', '#f1e05a', '#e34c26', '#563d7c', '#2b7489', '#f0db4f'];

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
          // maxWidth removed to rely on global width control
          padding: '24px',
          backgroundColor: bgColor,
          border: `1px solid ${borderColor}`,
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          color: textColor,
          overflow: 'hidden', // Ensure no overflow crashes
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '16px', width: '100%' }}>
          <img
            src={avatarUrl}
            alt="Avatar"
            width={80}
            height={80}
            style={{
              borderRadius: '50%',
              marginRight: '20px',
              border: `2px solid ${borderColor}`
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '24px', fontWeight: 700, lineHeight: 1.2 }}>{name}</span>
                {joinedDate && <span style={{ fontSize: '12px', color: secondaryText }}>Since {joinedDate}</span>}
            </div>
            <span style={{ fontSize: '16px', color: secondaryText, marginBottom: 8 }}>@{username}</span>
            
            {/* Meta Info Row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '12px', color: secondaryText }}>
                {location && ( <span style={{ display: 'flex', alignItems: 'center' }}>📍 {location}</span> )}
                {company && ( <span style={{ display: 'flex', alignItems: 'center' }}>🏢 {company}</span> )}
                {blog && ( <span style={{ display: 'flex', alignItems: 'center' }}>🔗 {blog.replace(/^https?:\/\//, '')}</span> )}
            </div>
          </div>
        </div>

        {/* Bio */}
        {bio && (
            <div style={{ display: 'flex', marginBottom: '24px', fontSize: '14px', color: secondaryText, lineHeight: '1.5', fontStyle: 'italic', borderLeft: `3px solid ${isDark ? '#30363d' : '#e1e4e8'}`, paddingLeft: '12px' }}>
                "{bio.length > 120 ? bio.substring(0, 120) + '...' : bio}"
            </div>
        )}

        {/* Stats Grid - 4 Columns */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', marginBottom: '24px' }}>
             <div style={{ display: 'flex', flex: 1,  flexDirection: 'column', alignItems: 'center', padding: '10px', backgroundColor: isDark ? '#161b22' : '#f6f8fa', borderRadius: '8px', border: `1px solid ${borderColor}` }}>
                <span style={{ fontSize: '18px', fontWeight: 700 }}>{stars}</span>
                <span style={{ fontSize: '11px', color: secondaryText, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Stars</span>
             </div>
             <div style={{ display: 'flex', flex: 1,  flexDirection: 'column', alignItems: 'center', padding: '10px', backgroundColor: isDark ? '#161b22' : '#f6f8fa', borderRadius: '8px', border: `1px solid ${borderColor}` }}>
                <span style={{ fontSize: '18px', fontWeight: 700 }}>{forks}</span>
                <span style={{ fontSize: '11px', color: secondaryText, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Forks</span>
             </div>
             <div style={{ display: 'flex',  flex: 1, flexDirection: 'column', alignItems: 'center', padding: '10px', backgroundColor: isDark ? '#161b22' : '#f6f8fa', borderRadius: '8px', border: `1px solid ${borderColor}` }}>
                <span style={{ fontSize: '18px', fontWeight: 700 }}>{followers}</span>
                <span style={{ fontSize: '11px', color: secondaryText, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Followers</span>
             </div>
             <div style={{ display: 'flex',  flex: 1, flexDirection: 'column', alignItems: 'center', padding: '10px', backgroundColor: isDark ? '#161b22' : '#f6f8fa', borderRadius: '8px', border: `1px solid ${borderColor}` }}>
                <span style={{ fontSize: '18px', fontWeight: 700 }}>{repos}</span>
                <span style={{ fontSize: '11px', color: secondaryText, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Repos</span>
             </div>
        </div>

        {/* Top Languages */}
        {parsedLanguages.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, marginBottom: '8px', color: secondaryText, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Top Languages</span>
                
                {/* Visual Bar */}
                <div style={{ display: 'flex', width: '100%', height: '10px', borderRadius: '6px', overflow: 'hidden', marginBottom: '10px' }}>
                    {parsedLanguages.map((lang: any, i: number) => (
                        <div key={lang.name} style={{ width: `${(lang.count / totalLangCount) * 100}%`, height: '100%', backgroundColor: colors[i % colors.length] }} />
                    ))}
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                     {parsedLanguages.map((lang: any, i: number) => (
                        <div key={lang.name} style={{ display: 'flex', alignItems: 'center', fontSize: '12px', color: secondaryText }}>
                             <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: colors[i % colors.length], marginRight: '6px' }} />
                             <span style={{ fontWeight: 500, marginRight: '4px', color: textColor }}>{lang.name}</span>
                             <span style={{ opacity: 0.6 }}>{Math.round((lang.count / totalLangCount) * 100)}%</span>
                        </div>
                    ))}
                </div>
            </div>
        )}
        
        {/* Footer */}
        <div style={{ display: 'flex', marginTop: '20px', fontSize: '10px', color: secondaryText, justifyContent: 'space-between', opacity: 0.5 }}>
            <span>{new Date().toLocaleDateString()}</span>
            <span>Generated by Readme-UI</span>
        </div>
      </div>
    </div>
  );
};
