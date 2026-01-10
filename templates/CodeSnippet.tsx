import React from 'react';

interface CodeSnippetProps {
    code?: string;
    title?: string;
    language?: string;
    theme?: 'dark' | 'light';
    width?: number;
    height?: number;
}

export const CodeSnippet: React.FC<CodeSnippetProps> = ({
    code = 'const dev = {\n  name: "Adielson",\n  role: "Full Stack"\n};',
    title = 'AboutMe.js',
    language = 'javascript',
    theme = 'dark',
    width = 600,
    height = 300
}) => {
    
    // Tokenizer function compatible with Satori (returns JSX, no dangerouslySetInnerHTML)
    const renderHighlightedLine = (line: string, lineIndex: number) => {
        // Split by token types regex, keeping the delimiters in the result array
        // Order matters: Strings -> Punctuation -> Keywords -> Numbers -> Whitespace
        const regex = /(".*?"|'.*?'|\/\/.*$|[{}[\],:;]|\b(?:const|let|var|function|return|import|export|from|default|class|interface|type|extends|implements)\b|\b\d+\b)/g;
        
        const parts = line.split(regex);

        return (
            <div key={lineIndex} style={{ display: 'flex', whiteSpace: 'pre' }}>
                 <span style={{ 
                            color: '#484f58', 
                            userSelect: 'none', 
                            width: '32px', 
                            textAlign: 'right', 
                            marginRight: '20px',
                            fontSize: '14px',
                            opacity: 0.5
                        }}>
                            {lineIndex + 1}
                </span>
                {parts.map((part, i) => {
                    if (!part) return null;

                    let color = '#c9d1d9'; // Default (Variables, etc)

                    // Determine color based on token type
                    if (part.startsWith('"') || part.startsWith("'")) {
                        color = '#a5d6ff'; // String
                    } else if (part.startsWith('//')) {
                        color = '#8b949e'; // Comment
                    } else if (/^(const|let|var|function|return|import|export|from|default|class|interface|type|extends|implements)$/.test(part)) {
                        color = '#ff7b72'; // Keyword
                    } else if (/^\d+$/.test(part)) {
                        color = '#79c0ff'; // Number
                    } else if (/^[{}[\],:;]$/.test(part)) {
                        color = '#e3b341'; // Punctuation
                    } else if (/^[A-Za-z0-9_]+$/.test(part)) {
                         // Check if it's a key (followed by colon is hard to detect in split array context without lookahead, but simple heuristic: color keys blueish if desired, or leave plain)
                         // For now, leave variables plain or maybe blue for Keys if we wanted.
                         // Let's make object keys specific color if possible? No, too complex for simple split.
                         color = '#c9d1d9';
                    }

                    return <span key={i} style={{ color }}>{part}</span>;
                })}
            </div>
        );
    };

    // Handle line breaks
    const lines = code.split(/\\n|\n|\|/); 

    const bgColor = '#0d1117';
    const headerColor = '#161b22';
    const borderColor = '#30363d';

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            backgroundColor: bgColor,
            borderRadius: '12px',
            border: `1px solid ${borderColor}`,
            fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
        }}>
            {/* Header / Title Bar */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                backgroundColor: headerColor,
                borderBottom: `1px solid ${borderColor}`,
                gap: '12px'
            }}>
                {/* Traffic Lights */}
                <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
                </div>
                
                {/* Title */}
                <div style={{ 
                    color: '#8b949e', 
                    fontSize: '14px', 
                    marginLeft: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                }}>
                    {/* Folder/JS Icon placeholder */}
                     <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path fillRule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" />
                    </svg>
                    {title}
                </div>
            </div>

            {/* Code Area */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '24px',
                color: '#c9d1d9',
                fontSize: '16px',
                lineHeight: '1.6',
            }}>
                {lines.map((line, i) => renderHighlightedLine(line, i))}
            </div>
        </div>
    );
};
