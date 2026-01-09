import React from 'react';

export interface GithubStatsProps {
  username?: string;
  name?: string;
  stars?: number;
  followers?: number;
  repos?: number;
  forks?: number;
  size?: string;
  prs?: number;
  issues?: number;
  orgs?: number;
  contributions?: number;
  avatarUrl?: string;
  theme?: 'dark' | 'light';
  location?: string;
  bio?: string;
  company?: string;
  blog?: string;
  joinedDate?: string;
  languages?: string; // JSON string
  topics?: string; // JSON string
}

const calculateRank = ({ stars, followers, repos, forks, prs, contributions }: any) => {
    const score = (stars * 4) + (followers * 2) + (forks * 3) + (repos * 1) + ((prs || 0) * 3) + ((contributions || 0) * 0.5);
    
    if (score > 500) return 'S+';
    if (score > 200) return 'S';
    if (score > 100) return 'A+';
    if (score > 50) return 'A';
    if (score > 20) return 'B+';
    if (score > 5) return 'B';
    return 'C';
};

export const GithubStats: React.FC<GithubStatsProps> = ({
  username = "octocat",
  name = "The Octocat",
  stars = 0,
  followers = 500,
  repos = 30,
  forks = 0,
  size = "0 KB",
  prs = 0,
  issues = 0,
  orgs = 0,
  contributions = 0,
  avatarUrl = "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
  theme = 'dark',
  location,
  bio,
  company,
  blog,
  joinedDate,
  languages,
  topics
}) => {
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#0d1117' : '#ffffff';
  const textColor = isDark ? '#c9d1d9' : '#24292f';
  const borderColor = isDark ? '#30363d' : '#e1e4e8';
  const secondaryText = isDark ? '#8b949e' : '#586069';

  const parsedLanguages = languages ? JSON.parse(languages) : [];
  const parsedTopics = topics ? JSON.parse(topics) : [];
  
  const totalLangCount = parsedLanguages.reduce((acc: number, l: any) => acc + l.count, 0);
  const rank = calculateRank({ stars, followers, repos, forks, prs, contributions });


  // Language Colors
  const colors = ['#3178c6', '#f1e05a', '#e34c26', '#563d7c', '#2b7489', '#f0db4f'];
  
  // Rank Colors
  const rankColors: Record<string, string> = {
      'S+': '#ff0055', 'S': '#00bfff', 'A+': '#2ea043', 'A': '#2ea043', 'B+': '#e3b341', 'B': '#e3b341', 'C': '#8b949e'
  };

  const statStyle = {
      display: 'flex', flex: 1, flexDirection: 'column' as const, alignItems: 'center', padding: '10px', backgroundColor: isDark ? '#161b22' : '#f6f8fa', borderRadius: '8px', border: `1px solid ${borderColor}`
  };

  const statLabelStyle = { fontSize: '11px', color: secondaryText, textTransform: 'uppercase' as const, letterSpacing: '0.5px', marginTop: '4px' };
  const statValueStyle = { fontSize: '16px', fontWeight: 700 };

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
          <div style={{ display: 'flex', position: 'relative' }}>
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
                {/* Rank Badge */}
                <div style={{ 
                    display: 'flex', 
                    position: 'absolute', 
                    bottom: -5, 
                    right: 15, 
                    backgroundColor: rankColors[rank], 
                    color: '#fff', 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: 800, 
                    fontSize: '14px',
                    border: `3px solid ${bgColor}`,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }}>
                    {rank}
                </div>
          </div>

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
            <div style={{ display: 'flex', marginBottom: '20px', fontSize: '14px', color: secondaryText, lineHeight: '1.5', fontStyle: 'italic', borderLeft: `3px solid ${isDark ? '#30363d' : '#e1e4e8'}`, paddingLeft: '12px' }}>
                "{bio.length > 120 ? bio.substring(0, 120) + '...' : bio}"
            </div>
        )}

        {/* Topics */}
        {parsedTopics.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                {parsedTopics.map((topic: string) => (
                    <div key={topic} style={{
                        display: 'flex',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        backgroundColor: isDark ? 'rgba(56, 139, 253, 0.15)' : '#ddf4ff',
                        color: isDark ? '#58a6ff' : '#0969da',
                        fontSize: '11px',
                        fontWeight: 600,
                        border: `1px solid ${isDark ? 'rgba(56, 139, 253, 0.4)' : 'rgba(9, 105, 218, 0.2)'}`
                    }}>
                        #{topic}
                    </div>
                ))}
            </div>
        ) : (
            <div style={{ marginBottom: '24px', fontSize: '12px', color: secondaryText, fontStyle: 'italic' }}>
                No topics found (Add tags to your repos!)
            </div>
        )}

        {/* Stats Grid - 2 Rows x 4 Cols */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
             {/* Row 1 */}
             <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                <div style={statStyle}>
                    <span style={statValueStyle}>{stars}</span>
                    <span style={statLabelStyle}>Stars</span>
                </div>
                <div style={statStyle}>
                    <span style={statValueStyle}>{followers}</span>
                    <span style={statLabelStyle}>Followers</span>
                </div>
                <div style={statStyle}>
                    <span style={statValueStyle}>{forks}</span>
                    <span style={statLabelStyle}>Forks</span>
                </div>
                <div style={statStyle}>
                    <span style={statValueStyle}>{contributions}</span>
                    <span style={statLabelStyle}>Contribs</span>
                </div>
             </div>
             
             {/* Row 2 */}
             <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                <div style={statStyle}>
                    <span style={statValueStyle}>{repos}</span>
                    <span style={statLabelStyle}>Repos</span>
                </div>
                 <div style={statStyle}>
                    <span style={statValueStyle}>{size}</span>
                    <span style={statLabelStyle}>Size</span>
                </div>
                <div style={statStyle}>
                    <span style={statValueStyle}>{prs}</span>
                    <span style={statLabelStyle}>PRs</span>
                </div>
                <div style={statStyle}>
                    <span style={statValueStyle}>{issues}</span>
                    <span style={statLabelStyle}>Issues</span>
                </div>
             </div>
        </div>

        {/* Top Languages */}
        {parsedLanguages.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, marginBottom: '8px', color: secondaryText, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Top Languages</span>
                
                {/* Visual Bar */}
                <div style={{ display: 'flex', width: '100%', height: '10px', borderRadius: '6px', overflow: 'hidden', marginBottom: '10px' }}>
                    {parsedLanguages.map((lang: any, i: number) => {
                        const color = lang.name === 'Others' ? '#8b949e' : colors[i % colors.length];
                        return (
                            <div key={lang.name} style={{ width: `${(lang.count / totalLangCount) * 100}%`, height: '100%', backgroundColor: color }} />
                        );
                    })}
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                     {parsedLanguages.map((lang: any, i: number) => {
                        const color = lang.name === 'Others' ? '#8b949e' : colors[i % colors.length];
                        return (
                            <div key={lang.name} style={{ display: 'flex', alignItems: 'center', fontSize: '12px', color: secondaryText }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color, marginRight: '6px' }} />
                                <span style={{ fontWeight: 500, marginRight: '4px', color: textColor }}>{lang.name}</span>
                                <span style={{ opacity: 0.6 }}>{Math.round((lang.count / totalLangCount) * 100)}%</span>
                            </div>
                        );
                     })}
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
