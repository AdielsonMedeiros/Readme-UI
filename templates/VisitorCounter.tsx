import React from 'react';

export interface VisitorCounterProps {
  count?: number;
  label?: string;
  theme?: 'dark' | 'light';
  width?: number;
  height?: number;
}

export const VisitorCounter: React.FC<VisitorCounterProps> = ({
  count = 1234,
  label = "Profile Views",
  theme = 'dark',
  width,
  height
}) => {
  const isTiny = (width && width < 300) || (height && height < 150);
  
  const extPadding = isTiny ? 8 : 24;
  const intPadding = isTiny ? '8px 16px' : '16px 28px';
  const iconSize = isTiny ? 32 : 40;
  const svgSize = isTiny ? 16 : 20;
  const gap = isTiny ? 8 : 16;
  const fontSizeCount = isTiny ? '20px' : '28px';
  const fontSizeLabel = isTiny ? '10px' : '12px';
  
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#0d1117' : '#ffffff';
  const textColor = isDark ? '#e6edf3' : '#24292f';
  const secondaryText = isDark ? '#8b949e' : '#586069';
  const accentColor = isDark ? '#238636' : '#2ea043';
  const borderColor = isDark ? '#30363d' : '#e1e4e8';

  // Format number with commas
  const formattedCount = count.toLocaleString();

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bgColor,
        fontFamily: 'Instrument Sans, sans-serif',
        padding: `${extPadding}px`,
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: `${gap}px`,
          padding: intPadding,
          backgroundColor: isDark ? '#161b22' : '#f6f8fa',
          border: `1px solid ${borderColor}`,
          borderRadius: '50px',
          boxShadow: isDark 
            ? '0 4px 16px rgba(0,0,0,0.3)' 
            : '0 4px 16px rgba(0,0,0,0.1)',
        }}
      >
        {/* Eye Icon */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: `${iconSize}px`,
          height: `${iconSize}px`,
          borderRadius: '50%',
          backgroundColor: accentColor,
        }}>
          <svg width={svgSize} height={svgSize} viewBox="0 0 16 16" fill="white">
            <path d="M8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.45.678-1.367 1.932-2.637 3.023C11.67 13.008 9.981 14 8 14c-1.981 0-3.671-.992-4.933-2.078C1.797 10.83.88 9.576.43 8.898a1.62 1.62 0 0 1 0-1.798c.45-.677 1.367-1.931 2.637-3.022C4.33 2.992 6.019 2 8 2ZM1.679 7.932a.12.12 0 0 0 0 .136c.411.622 1.241 1.75 2.366 2.717C5.176 11.758 6.527 12.5 8 12.5c1.473 0 2.825-.742 3.955-1.715 1.124-.967 1.954-2.096 2.366-2.717a.12.12 0 0 0 0-.136c-.412-.621-1.242-1.75-2.366-2.717C10.824 4.242 9.473 3.5 8 3.5c-1.473 0-2.824.742-3.955 1.715-1.124.967-1.954 2.096-2.366 2.717ZM8 10a2 2 0 1 1-.001-3.999A2 2 0 0 1 8 10Z"/>
          </svg>
        </div>

        {/* Count */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{
            fontSize: fontSizeCount,
            fontWeight: 700,
            color: textColor,
          }}>
            {formattedCount}
          </span>
          <span style={{
            fontSize: fontSizeLabel,
            fontWeight: 500,
            color: secondaryText,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            {label}
          </span>
        </div>
      </div>
    </div>
  );
};
