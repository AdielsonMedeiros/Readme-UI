import React from 'react';

export interface WeatherWidgetProps {
  city?: string;
  temperature?: number; // degrees celsius
  condition?: string; // Clear, Rainy, Cloudy, etc.
  isDay?: boolean;
  theme?: 'dark' | 'light';
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  city = "San Francisco",
  temperature = 22,
  condition = "Partly Cloudy",
  isDay = true,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';
  // Dynamic background based on time of day/condition
  const bgGradient = isDay 
    ? 'linear-gradient(135deg, #60a5fa, #3b82f6)' // Blue Sky
    : 'linear-gradient(135deg, #1e293b, #0f172a)'; // Night

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Instrument Sans, sans-serif',
        padding: '0', // Full bleed
        background: bgGradient,
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '40px',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        {/* Left: Temp & City */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '80px', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{Math.round(temperature)}</span>
                <span style={{ fontSize: '32px', fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginTop: '12px' }}>°C</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '24px', fontWeight: 700, color: '#fff' }}>{city}</span>

            </div>
        </div>

        {/* Right: Icon (Placeholder for easy SVG Logic in API) */}
        <div style={{ 
            display: 'flex',
            width: '120px', 
            height: '120px', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
        }}>
            {/* Sun/Cloud Icon will be injected here */}
            {isDay ? (
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" fill="#fbbf24" stroke="none" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
            ) : (
                 <svg width="64" height="64" viewBox="0 0 24 24" fill="#fcd34d" stroke="#fcd34d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
            )}
        </div>
      </div>
    </div>
  );
};
