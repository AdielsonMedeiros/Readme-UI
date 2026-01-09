import React from 'react';

export interface MusicVisualizerProps {
  trackName?: string;
  artist?: string;
  coverUrl?: string;
  theme?: 'dark' | 'light';
  barColor?: string;
}

export const MusicVisualizer: React.FC<MusicVisualizerProps> = ({
  trackName = "Midnight City",
  artist = "M83",
  coverUrl = "",
  theme = 'dark',
  barColor = "#1db954"
}) => {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(to right, #121212, #181818)',
        alignItems: 'center',
        padding: '20px',
        fontFamily: 'sans-serif',
        color: '#fff',
        gap: '20px',
        borderRadius: '12px',
        border: '1px solid #333'
      }}
    >
        {/* Cover Art Placeholder */}
        <div style={{ width: '80px', height: '80px', background: '#333', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            🎵
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{trackName}</span>
            <span style={{ fontSize: '14px', color: '#b3b3b3' }}>{artist}</span>
            
            {/* Bars Preview */}
            <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '30px', marginTop: '15px' }}>
                {[40, 70, 50, 90, 60, 30, 80, 50, 70, 45].map((h, i) => (
                    <div key={i} style={{ width: '6px', height: `${h}%`, backgroundColor: barColor, borderRadius: '2px 2px 0 0' }} />
                ))}
            </div>
        </div>
    </div>
  );
};
