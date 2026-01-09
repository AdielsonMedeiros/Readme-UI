import React from 'react';

export interface HackingTerminalProps {
  username?: string;
  repos?: string[]; // List of real repo names
  theme?: 'dark' | 'light';
}

export const HackingTerminal: React.FC<HackingTerminalProps> = ({
  username = "User",
  repos = ["sys-core", "auth-module", "neural-net", "crypto-shredder"],
  theme = 'dark'
}) => {
  const width = 600;
  const height = 300;
  
  // Generate log lines using real repo names
  const logs = [
    `> INITIALIZING_CONNECTION...`,
    `> TARGET: ${username}@github.com`,
    `> BYPASSING_FIREWALL... [SUCCESS]`,
    `> ACCESSING_MAINFRAME...`,
    `> FETCHING_REPOSITORIES...`,
    ...repos.slice(0, 3).map(r => `> DOWNLOADING_SOURCE: ${r}...`),
    `> COMPILING_ASSETS...`,
    `> DEPLOYING_TO_PRODUCTION...`,
    `> SYSTEM_READY`
  ];

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        backgroundColor: '#0d1117',
        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
        padding: '24px',
        color: '#39d353',
        fontSize: '14px',
        lineHeight: '1.5',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {/* Terminal Header */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid #30363d', 
          paddingBottom: '12px',
          marginBottom: '12px',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
          <span style={{ marginLeft: '12px', color: '#8b949e', fontSize: '12px' }}>bash — {username}</span>
        </div>

        {/* Terminal Body - Static Preview for now, real animation happens in API Route due to SVG requirements */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {logs.map((log, i) => (
            <div key={i} style={{ display: 'flex', color: i === logs.length - 1 ? '#fff' : (log.includes('SUCCESS') ? '#3fb950' : '#39d353') }}>
              {log}
            </div>
          ))}
          <div style={{ display: 'flex' }}>
            <span style={{ color: '#fff' }}>$</span>
            <span style={{ width: '8px', height: '16px', backgroundColor: '#39d353', marginLeft: '8px', animation: 'blink 1s infinite' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
