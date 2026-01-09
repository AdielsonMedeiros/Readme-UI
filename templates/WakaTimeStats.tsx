import React from 'react';

export interface WakaTimeStatsProps {
  username?: string;
  totalTime?: string;
  dailyAverage?: string;
  languages?: { name: string; percent: number; time: string; color: string }[];
  theme?: 'dark' | 'light';
}

export const WakaTimeStats: React.FC<WakaTimeStatsProps> = ({
  username = "Developer",
  totalTime = "45 hrs 30 mins",
  dailyAverage = "6 hrs 15 mins",
  languages = [
    { name: 'TypeScript', percent: 45, time: '20 hrs', color: '#3178c6' },
    { name: 'Python', percent: 25, time: '11 hrs', color: '#3572A5' },
    { name: 'Rust', percent: 15, time: '6 hrs', color: '#dea584' },
    { name: 'Other', percent: 15, time: '8 hrs', color: '#8b949e' },
  ],
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#0d1117' : '#ffffff';
  const borderColor = isDark ? '#30363d' : '#e1e4e8';
  const textColor = isDark ? '#c9d1d9' : '#24292f';
  const dimColor = isDark ? '#8b949e' : '#586069';

  return (
    <div style={{
      display: 'flex',
      width: '100%',
      height: '100%',
      backgroundColor: bgColor,
      border: `1px solid ${borderColor}`,
      borderRadius: '12px',
      fontFamily: 'Segoe UI, Ubuntu, sans-serif',
      padding: '20px',
      boxSizing: 'border-box',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
         <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12px', color: dimColor, fontWeight: 600, textTransform: 'uppercase' }}>WakaTime Stats</span>
            <span style={{ fontSize: '18px', fontWeight: 700, color: textColor }}>{totalTime}</span>
         </div>
         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
             <span style={{ fontSize: '10px', color: dimColor }}>Daily Average</span>
             <span style={{ fontSize: '14px', fontWeight: 600, color: textColor }}>{dailyAverage}</span>
         </div>
      </div>

      {/* Languages List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        {languages.slice(0, 5).map((lang, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
                <span style={{ fontWeight: 500, color: textColor, display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: lang.color || '#888', marginRight: '8px' }} />
                    {lang.name}
                </span>
                <span style={{ color: dimColor }}>{lang.time} ({lang.percent}%)</span>
            </div>
            
            <div style={{ width: '100%', height: '6px', backgroundColor: isDark ? '#21262d' : '#eaeef2', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${lang.percent}%`, height: '100%', backgroundColor: lang.color || '#888', borderRadius: '3px' }} />
            </div>

          </div>
        ))}
      </div>
      
      <div style={{ marginTop: 'auto', fontSize: '10px', color: dimColor, textAlign: 'right', paddingTop: '10px' }}>
          Last 7 Days
      </div>

    </div>
  );
};
