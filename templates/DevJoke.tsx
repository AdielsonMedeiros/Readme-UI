import React from 'react';

export interface DevJokeProps {
  joke?: string;
  punchline?: string;
  theme?: 'dark' | 'light';
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
  theme = 'dark'
}) => {
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
        padding: '24px',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          padding: '28px',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <span style={{ fontSize: '28px' }}>😂</span>
          <span style={{ fontSize: '14px', fontWeight: 600, color: accentColor, textTransform: 'uppercase', letterSpacing: '1px' }}>
            Dev Joke
          </span>
        </div>

        {/* Joke */}
        <div style={{
          display: 'flex',
          fontSize: '18px',
          fontWeight: 600,
          color: textColor,
          marginBottom: '16px',
          lineHeight: 1.5,
        }}>
          {selectedJoke}
        </div>

        {/* Punchline */}
        <div style={{
          display: 'flex',
          fontSize: '16px',
          fontStyle: 'italic',
          color: secondaryText,
          paddingLeft: '16px',
          borderLeft: `3px solid ${accentColor}`,
        }}>
          {selectedPunchline}
        </div>
      </div>
    </div>
  );
};
