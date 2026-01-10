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
  barColor = "#1ED760"
}) => {
  // Generate pseudo-random bars for visualizer effect based on track name length derived seed or just random
  // Using simple random for visual appeal in this static generation context
  const bars = [40, 60, 55, 80, 45, 30, 70, 90, 60, 50, 40, 80, 55, 30, 65, 50, 75, 95, 40, 60, 50, 80, 45, 30, 70, 90, 60, 50, 40, 80];

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(to right, #121212, #181818)',
        padding: '20px',
        fontFamily: 'sans-serif',
        color: '#fff',
        gap: '20px',
        borderRadius: '12px',
        boxSizing: 'border-box',
        alignItems: 'center',
        overflow: 'hidden'
      }}
    >
        {/* Cover Art Placeholder */}
        <div style={{ width: '80px', height: '80px', background: '#333', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', flexShrink: 0 }}>
            🎵
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '8px', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold', lineHeight: '1.2' }}>{trackName}</span>
                <span style={{ fontSize: '14px', color: '#b3b3b3', lineHeight: '1.2' }}>{artist}</span>
            </div>
            
            {/* Bars Preview */}
            <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: '30px', width: '100%' }}>
                {bars.map((h, i) => (
                    <div key={i} style={{ flex: 1, height: `${h}%`, backgroundColor: barColor, borderRadius: '2px 2px 0 0', opacity: 0.8 }} />
                ))}
            </div>
        </div>
    </div>
  );
};
