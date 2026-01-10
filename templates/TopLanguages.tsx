import React from 'react';

interface TopLanguagesProps {
    langs?: string; // Format: "Name:Percent:Color,Name:Percent:Color" (Color optional)
    theme?: 'dark' | 'light';
    width?: number;
    bg?: string;
}

const languageColors: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    Java: '#b07219',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Vue: '#41b883',
    React: '#61dafb',
    Go: '#00ADD8',
    Rust: '#dea584',
    C: '#555555',
    'C++': '#f34b7d',
    'C#': '#178600',
    Ruby: '#701516',
    Swift: '#ffac45',
    Kotlin: '#A97BFF',
    PHP: '#4F5D95',
    Shell: '#89e051',
    Dart: '#00B4AB'
};

export const TopLanguages: React.FC<TopLanguagesProps> = ({
    langs = 'TypeScript:60,JavaScript:30,CSS:10',
    theme = 'dark',
    width = 600,
    bg
}) => {
    // Parse input string
    const languages = langs.split(',').map(item => {
        const [name, percentStr, colorOverride] = item.split(':');
        const percent = parseFloat(percentStr) || 0;
        const color = colorOverride || languageColors[name] || '#8b949e';
        return { name, percent, color };
    });

    const totalPercent = languages.reduce((acc, curr) => acc + curr.percent, 0);
    // Normalize to 100% just in case
    const normalizedLangs = languages.map(l => ({
        ...l,
        percent: (l.percent / totalPercent) * 100
    }));

    const bgColor = bg || (theme === 'dark' ? '#0d1117' : '#ffffff');
    const textColor = theme === 'dark' ? '#c9d1d9' : '#24292f';

    let currentOffset = 0;

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif',
        }}>
           <h3 style={{ color: textColor, fontSize: '18px', fontWeight: '600', marginBottom: '16px', marginTop: '0' }}>Top Languages</h3>
           
           {/* Progress Bar */}
           <div style={{ 
               display: 'flex', 
               width: '100%', 
               height: '10px', 
               borderRadius: '6px', 
               overflow: 'hidden',
               backgroundColor: theme === 'dark' ? '#30363d' : '#e1e4e8',
               marginBottom: '16px'
           }}>
               {normalizedLangs.map((lang, i) => (
                   <div key={i} style={{
                       width: `${lang.percent}%`,
                       height: '100%',
                       backgroundColor: lang.color
                   }} />
               ))}
           </div>

           {/* Legend */}
           <div style={{
               display: 'flex',
               flexWrap: 'wrap',
               gap: '16px'
           }}>
               {normalizedLangs.map((lang, i) => (
                   <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                       <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: lang.color }} />
                       <span style={{ color: textColor, fontSize: '12px', fontWeight: '600' }}>{lang.name}</span>
                       <span style={{ color: theme === 'dark' ? '#8b949e' : '#586069', fontSize: '12px' }}>{Math.round(lang.percent)}%</span>
                   </div>
               ))}
           </div>
        </div>
    );
};
