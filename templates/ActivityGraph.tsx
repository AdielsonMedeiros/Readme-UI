import React from 'react';

export interface ActivityGraphProps {
  username?: string;
  theme?: 'dark' | 'light';
}

export const ActivityGraph: React.FC<ActivityGraphProps> = ({
  username = "User",
  theme = 'dark'
}) => {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        backgroundColor: '#0d1117',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        color: '#fff',
        flexDirection: 'column'
      }}
    >
        <span style={{ marginBottom: '20px', fontSize: '14px', color: '#8b949e' }}>@{username}'s Contribution Skyline</span>
        
        {/* Iso Grid Preview */}
        <div style={{ display: 'flex', gap: '2px', transform: 'rotateX(60deg) rotateZ(-45deg)', perspective: '1000px' }}>
           {/* Static blocks */}
           <div style={{ width: '20px', height: '20px', background: '#39d353', boxShadow: '-2px 2px 0 #2ea043' }} />
           <div style={{ width: '20px', height: '20px', background: '#26a641', boxShadow: '-2px 2px 0 #006d32' }} />
           <div style={{ width: '20px', height: '20px', background: '#0e4429', boxShadow: '-2px 2px 0 #002b16' }} />
        </div>
        
        <div style={{ marginTop: '30px', fontSize: '12px', color: '#58a6ff' }}>
            3D Rendering active...
        </div>
    </div>
  );
};
