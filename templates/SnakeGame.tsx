import React from 'react';

export interface SnakeGameProps {
  theme?: 'dark' | 'light';
  commits?: number;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({
  theme = 'dark',
  commits = 1042
}) => {
  // Static preview representation
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        backgroundColor: '#0d1117',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        fontFamily: 'sans-serif',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'absolute', top: 10, right: 10, fontSize: '10px', color: '#8b949e' }}>
         {commits} User Contributions
      </div>
      
      {/* Grid Background */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(20, 10px)', gap: '2px', opacity: 0.2 }}>
        {Array.from({ length: 160 }).map((_, i) => (
            <div key={i} style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#21262d' }} />
        ))}
      </div>

      {/* Snake Preview */}
      <div style={{ position: 'absolute' }}>
         <span style={{ color: '#39d353', fontSize: '12px' }}>● ● ● ● ● 🐍</span>
      </div>
      
      <div style={{ marginTop: '20px', color: '#8b949e', fontSize: '12px' }}>
        Rendering animated Git Snake...
      </div>
    </div>
  );
};
