import React from 'react';

export interface HackingTerminalProps {
  username?: string;
  repos?: string[]; // List of real repo names
  theme?: 'dark' | 'light';
}

export const HackingTerminal: React.FC<HackingTerminalProps> = ({
  username = "AdielsonMedeiros",
  repos = ["Readme-UI", "AdielsonMedeiros", "Sistema-de-informacoes-Climaticas"],
  theme = 'dark'
}) => {
  // Generate log lines using real repo names
  // Ensure we have at least some defaults if repos is empty
  const targetRepos = (repos && repos.length > 0) ? repos : ["sys-core", "auth-module", "neural-net"];
  
  const logs = [
    `> INITIALIZING_CONNECTION...`,
    `> TARGET: ${username}@github.com`,
    `> BYPASSING_FIREWALL... [SUCCESS]`,
    `> ACCESSING_MAINFRAME...`,
    `> FETCHING_REPOSITORIES...`,
    ...targetRepos.slice(0, 3).map(r => `> DOWNLOADING_SOURCE: ${r}...`),
    `> COMPILING_ASSETS...`,
    `> DEPLOYING_TO_PRODUCTION...`,
    `> SYSTEM_READY`
  ];

  const bgColor = '#050505'; // Deep black/gray
  const terminalGreen = '#00ff41'; // Hacker green
  const dimGreen = '#008F11'; // Matrix dark green for subtle elements (optional, sticking to vibrant for text)
  const textColor = '#4af626'; // Vibrant readable green
  const borderColor = '#333';

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        backgroundColor: bgColor,
        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
        padding: '0', // Container padding
        boxSizing: 'border-box',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
        {/* Terminal Window Card */}
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '95%',
            height: '92%',
            backgroundColor: '#0c0c0c',
            borderRadius: '10px',
            border: '1px solid #333',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            overflow: 'hidden'
        }}>
            {/* Terminal Header */}
            <div style={{ 
            display: 'flex', 
            height: '40px',
            borderBottom: '1px solid #333', 
            padding: '0 16px',
            alignItems: 'center',
            backgroundColor: '#111',
            gap: '8px'
            }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
            <span style={{ marginLeft: '12px', color: '#666', fontSize: '12px', fontWeight: 500 }}>bash — {username}</span>
            </div>

            {/* Terminal Body */}
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                padding: '24px', 
                gap: '8px',
                fontSize: '14px',
                color: textColor,
                textShadow: '0 0 5px rgba(74, 246, 38, 0.3)' // Subtle glow
            }}>
            {logs.map((log, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                {log.includes('[SUCCESS]') ? (
                    <span style={{ display: 'flex' }}>
                        {log.split('[SUCCESS]')[0]}
                        <span style={{ color: textColor, fontWeight: 'bold' }}>[SUCCESS]</span>
                    </span>
                ) : (
                    log
                )}
                </div>
            ))}
            <div style={{ display: 'flex',  alignItems: 'center', marginTop: '4px' }}>
                <span style={{ marginRight: '8px' }}>$</span>
                {/* Block Cursor */}
                <div style={{ width: '10px', height: '20px', backgroundColor: textColor }} />
            </div>
            </div>
        </div>
    </div>
  );
};
