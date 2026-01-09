import React from 'react';

export interface WaveBannerProps {
  text?: string;
  subtitle?: string;
  theme?: 'dark' | 'light';
  gradient?: 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'cyan';
}

export const WaveBanner: React.FC<WaveBannerProps> = ({
  text = "Hello, I'm Adielson",
  subtitle = "Full Stack Developer",
  theme = 'dark',
  gradient = 'blue'
}) => {
  const isDark = theme === 'dark';
  
  // Gradient presets
  const gradients: Record<string, string> = {
    blue: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    purple: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
    green: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    orange: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
    pink: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
    cyan: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
  };

  const bgGradient = gradients[gradient] || gradients.blue;
  const textColor = '#ffffff';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        background: bgGradient,
        fontFamily: 'Instrument Sans, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        zIndex: 10,
        padding: '40px',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'flex',
          fontSize: '48px',
          fontWeight: 800,
          color: textColor,
          textShadow: '0 4px 12px rgba(0,0,0,0.3)',
          marginBottom: '12px',
        }}>
          {text}
        </div>
        {subtitle && (
          <div style={{
            display: 'flex',
            fontSize: '22px',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.9)',
            textShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}>
            {subtitle}
          </div>
        )}
      </div>

      {/* Wave SVG at bottom */}
      <svg
        viewBox="0 0 1440 120"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '80px',
        }}
      >
        <path
          fill={isDark ? '#0d1117' : '#ffffff'}
          d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
        />
      </svg>

      {/* Decorative circles */}
      <div style={{
        display: 'flex',
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)',
      }} />
      <div style={{
        display: 'flex',
        position: 'absolute',
        bottom: '50px',
        left: '-30px',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.08)',
      }} />
    </div>
  );
};
