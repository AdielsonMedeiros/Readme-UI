import React from 'react';

export interface DevJokeProps {
  joke?: string;
  punchline?: string;
  theme?: 'dark' | 'light';
  width?: number;
  height?: number;
}

const defaultJokes = [
  { joke: "Why do programmers prefer dark mode?", punchline: "Because light attracts bugs!" },
  { joke: "Why do Java developers wear glasses?", punchline: "Because they can't C#!" },
  { joke: "A SQL query walks into a bar, walks up to two tables and asks...", punchline: "'Can I join you?'" },
  { joke: "Why was the JavaScript developer sad?", punchline: "Because he didn't Node how to Express himself!" },
  { joke: "What's a programmer's favorite hangout place?", punchline: "Foo Bar!" },
  { joke: "Why do programmers hate nature?", punchline: "It has too many bugs!" },
];

export const DevJoke: React.FC<DevJokeProps> = ({
  joke,
  punchline,
  theme = 'dark',
  width,
  height
}) => {
  const isTiny = (width && width < 300) || (height && height < 180);
  const isSmall = !isTiny && ((width && width < 450) || (height && height < 250));
  
  const extPadding = isTiny ? 8 : 24;
  const intPadding = isTiny ? 12 : 28;
  const headerGap = isTiny ? 6 : 10;
  const headerMb = isTiny ? 8 : 20;
  const jokeMb = isTiny ? 8 : 16;
  
  const emojiSize = isTiny ? 20 : 28;
  const labelSize = isTiny ? 10 : 14;
  const jokeSize = isTiny ? 14 : 18;
  const punchSize = isTiny ? 12 : 16;
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#0d1117' : '#ffffff';
  const textColor = isDark ? '#e6edf3' : '#24292f';
  const secondaryText = isDark ? '#8b949e' : '#586069';
  const borderColor = isDark ? '#30363d' : '#e1e4e8';
  const accentColor = '#f0883e';

  // Use provided joke or random default
  const randomJoke = defaultJokes[Math.floor(Math.random() * defaultJokes.length)];
  const selectedJoke = joke || randomJoke.joke;
  const selectedPunchline = punchline || randomJoke.punchline;

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
          flexDirection: 'column',
          width: '100%',
          padding: `${intPadding}px`,
          backgroundColor: isDark ? '#161b22' : '#f6f8fa',
          border: `1px solid ${borderColor}`,
          borderRadius: '16px',
          boxShadow: isDark 
            ? '0 8px 24px rgba(0,0,0,0.4)' 
            : '0 8px 24px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: `${headerGap}px`, marginBottom: `${headerMb}px` }}>
          <span style={{ fontSize: `${emojiSize}px` }}>😂</span>
          {!isTiny && (
            <span style={{ fontSize: `${labelSize}px`, fontWeight: 600, color: accentColor, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Dev Joke
            </span>
          )}
        </div>

        {/* Joke */}
        <div style={{
          display: 'flex',
          fontSize: `${jokeSize}px`,
          fontWeight: 600,
          color: textColor,
          marginBottom: `${jokeMb}px`,
          lineHeight: 1.5,
        }}>
          {selectedJoke}
        </div>

        {/* Punchline */}
        <div style={{
          display: 'flex',
          fontSize: `${punchSize}px`,
          fontStyle: 'italic',
          color: secondaryText,
          paddingLeft: isTiny ? '8px' : '16px',
          borderLeft: `3px solid ${accentColor}`,
        }}>
          {selectedPunchline}
        </div>
      </div>
    </div>
  );
};
