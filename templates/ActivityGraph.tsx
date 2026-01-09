import React from 'react';

export interface ActivityGraphProps {
  username?: string;
  theme?: 'dark' | 'light';
  contributions?: Array<{ date: string; count: number; level: number }>;
}

export const ActivityGraph: React.FC<ActivityGraphProps> = ({
  username = "User",
  theme = 'dark',
  contributions = []
}) => {
  // Determine data source
  const hasData = contributions && contributions.length > 0;
  
  if (!hasData) {
      return (
        <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: '#0d1117', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#8b949e', fontFamily: 'sans-serif' }}>
            <span style={{ fontSize: '24px', marginBottom: '10px' }}>🧊</span>
            <span>No contribution data found for <strong>@{username}</strong></span>
            <span style={{ fontSize: '12px', marginTop: '5px', opacity: 0.7 }}>Ensure the profile is public or user exists.</span>
        </div>
      );
  }

  // Use real data (slice last 84 days for 12 weeks view)
  const data = contributions.slice(-84);

  // Isometric Projection Helper
  const tileWidth = 24;
  const tileHeight = 14; // Controls the angle/flatness
  const originX = 400; // Center horizontally
  const originY = 100;

  // Colors
  const colors = {
    bg: '#0d1117',
    blockTop: '#2ea043', 
    blockLeft: '#26a641',
    blockRight: '#006d32',
    emptyTop: '#161b22',
    emptySide: '#0d1117'
  };

  const getHeight = (count: number) => Math.min(count * 6 + 4, 60); // Scale height

  // Group data by weeks (7 days per column)
  // Reversing to draw from back to front (Painters Algorithm) if needed, 
  // but for isometric grid standard layout (row/col) works if ordered correctly.
  
  // Grid dimensions
  const rows = 7; // days
  const cols = 12; // weeks

  // Create a grid of 12 columns by 7 rows (84 items)
  // We need to pad the data if it's less than 84, or slice if more
  const displayData = data.slice(-84);
  const totalSlots = 12 * 7; // 84
  const offset = totalSlots - displayData.length;
  
  // Flatten generation
  const gridItems = Array.from({ length: totalSlots }).map((_, index) => {
      // Calculate Col/Row
      const c = Math.floor(index / 7);
      const r = index % 7;
      
      // Map index to data index (adjusting for offset if data < 84)
      const dataIndex = index - offset;
      
      if (dataIndex < 0 || dataIndex >= displayData.length) return null;
      
      const day = displayData[dataIndex];
      const count = day.count;
      const isVisible = count > 0;
      
      const h = isVisible ? Math.min(count * 6 + 4, 60) : 4;
      const x = 400 + (c - r) * 24;
      const y = 100 + (c + r) * 14;

      const colorTop = '#39d353';
      const colorLeft = '#26a641';
      const colorRight = '#0e4429';

      if (!isVisible) return null;

      // Top Face
      const pathTop = `M${x},${y - h} l24,14 l-24,14 l-24,-14 z`;

      return (
        <g key={index}>
            {/* Side Faces */}
            <path d={`M${x},${y+28} v${-h} l24,-14 v${h} z`} fill={colorRight} />
            <path d={`M${x},${y+28} v${-h} l-24,-14 v${h} z`} fill={colorLeft} />
            {/* Top Face */}
            <path d={pathTop} fill={colorTop} stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
        </g>
      );
  });

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
        overflow: 'hidden'
      }}
    >
        <svg width="100%" height="100%" viewBox="0 0 800 400">
           {gridItems}
        </svg>
    </div>
  );
};
