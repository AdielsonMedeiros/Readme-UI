import React from 'react';

export interface QuoteCardProps {
  quote?: string;
  author?: string;
  theme?: 'dark' | 'light';
}

const defaultQuotes = [
  { quote: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { quote: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { quote: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
  { quote: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { quote: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
];

export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  author,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#0d1117' : '#ffffff';
  const textColor = isDark ? '#e6edf3' : '#24292f';
  const borderColor = isDark ? '#30363d' : '#e1e4e8';
  const accentColor = isDark ? '#58a6ff' : '#0969da';

  // Use provided quote or random default
  const selectedQuote = quote || defaultQuotes[Math.floor(Math.random() * defaultQuotes.length)].quote;
  const selectedAuthor = author || defaultQuotes.find(q => q.quote === selectedQuote)?.author || 'Anonymous';

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
        padding: '32px',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          padding: '32px',
          backgroundColor: isDark ? '#161b22' : '#f6f8fa',
          border: `1px solid ${borderColor}`,
          borderRadius: '16px',
          boxShadow: isDark 
            ? '0 16px 32px rgba(0,0,0,0.4)' 
            : '0 16px 32px rgba(0,0,0,0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Quote Icon */}
        <div style={{
          display: 'flex',
          position: 'absolute',
          top: '-20px',
          left: '32px',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: accentColor,
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}>
          <span style={{ fontSize: '24px', color: '#ffffff' }}>"</span>
        </div>

        {/* Quote Text */}
        <div style={{
          display: 'flex',
          fontSize: '20px',
          fontWeight: 500,
          fontStyle: 'italic',
          color: textColor,
          lineHeight: 1.6,
          marginTop: '16px',
          marginBottom: '20px',
        }}>
          {selectedQuote}
        </div>

        {/* Author */}
        <div style={{
          display: 'flex',
          fontSize: '14px',
          fontWeight: 600,
          color: accentColor,
        }}>
          — {selectedAuthor}
        </div>
      </div>
    </div>
  );
};
