import React from 'react';

export interface LeetCodeStatsProps {
  username?: string;
  theme?: 'dark' | 'light';
  ranking?: number;
  totalSolved?: number;
  totalQuestions?: number;
  easySolved?: number;
  mediumSolved?: number;
  hardSolved?: number;
  acceptanceRate?: number;
}

export const LeetCodeStats: React.FC<LeetCodeStatsProps> = ({
  username = "LeetCodeUser",
  theme = 'dark',
  ranking = 15432,
  totalSolved = 450,
  totalQuestions = 2800,
  easySolved = 150,
  mediumSolved = 250,
  hardSolved = 50,
  acceptanceRate = 65.5
}) => {
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#1a1a1a' : '#ffffff'; // LeetCode dark is slightly gray
  const textColor = isDark ? '#eff1f6' : '#262626';
  const subTextColor = isDark ? '#9ca3af' : '#666666';
  
  // Colors
  const cEasy = '#00b8a3';
  const cMedium = '#ffc01e';
  const cHard = '#ff375f';
  
  // Circle Logic
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  // Let's visualize the ratio of Solved vs Total (though Total keeps growing, so maybe just an abstract circle or Easy/Med/Hard segments)
  // Let's do 3 segments for E/M/H distribution
  
  const total = easySolved + mediumSolved + hardSolved;
  const pctEasy = (easySolved / total) || 0;
  const pctMed = (mediumSolved / total) || 0;
  const pctHard = (hardSolved / total) || 0;
  
  const offEasy = 0;
  const offMed = -circumference * pctEasy;
  const offHard = -circumference * (pctEasy + pctMed);

  return (
    <div style={{
      display: 'flex',
      width: '100%',
      height: '100%',
      backgroundColor: bgColor,
      color: textColor,
      fontFamily: 'sans-serif',
      padding: '20px',
      boxSizing: 'border-box',
      alignItems: 'center',
      justifyContent: 'space-between', // Changed structure slightly to accommodate header
      position: 'relative'
    }}>
        {/* LeetCode Logo / Watermark (Optional) */}
        <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', opacity: 0.2 }}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill={textColor}>
               <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.396.702-1.863l4.332-4.364c.467-.467 1.112-.662 1.824-.662s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.055 5.055 0 0 0-2.445-1.337l2.467-2.503c.516-.514.498-1.366-.037-1.901-.535-.535-1.387-.552-1.902-.038l-10.1 10.101c-.981.982-1.494 2.337-1.494 3.835 0 1.498.513 2.853 1.494 3.835l10.1 10.101c.515.515 1.367.497 1.902-.037.535-.535.554-1.387.038-1.901l-2.467-2.503c.84-.23 1.641-.685 2.445-1.337l2.609-2.636c.514-.515.496-1.366-.039-1.901-.535-.536-1.386-.553-1.9-.038z"/>
            </svg>
        </div>

        {/* Left: Donut Chart */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '30px' }}>
             <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                     {/* Tracks */}
                     <circle cx="50" cy="50" r={radius} stroke={isDark ? '#2d2d2d' : '#f0f0f0'} strokeWidth="8" fill="none" />
                     
                     {/* Segments */}
                     <circle cx="50" cy="50" r={radius} stroke={cEasy} strokeWidth="8" fill="none" 
                             strokeDasharray={circumference} strokeDashoffset={circumference * (1 - pctEasy)} 
                             style={{ opacity: 0.8 }} />
                     
                     <circle cx="50" cy="50" r={radius} stroke={cMedium} strokeWidth="8" fill="none" 
                             strokeDasharray={circumference} strokeDashoffset={circumference * (1 - pctMed)} 
                             transform={`rotate(${pctEasy * 360} 50 50)`} />
                             
                     <circle cx="50" cy="50" r={radius} stroke={cHard} strokeWidth="8" fill="none" 
                             strokeDasharray={circumference} strokeDashoffset={circumference * (1 - pctHard)} 
                             transform={`rotate(${(pctEasy + pctMed) * 360} 50 50)`} />
                 </svg>
                 
                 <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                     <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{totalSolved}</span>
                     <span style={{ fontSize: '10px', color: subTextColor }}>Solved</span>
                 </div>
             </div>
             <span style={{ marginTop: '10px', fontSize: '12px', fontWeight: 'bold' }}>@{username}</span>
        </div>
        
        {/* Right: Stats Details */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '12px' }}>
            
            {/* Row Easy */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: subTextColor, width: '50px' }}>Easy</span>
                <span style={{ fontSize: '14px', fontWeight: 'bold', width: '40px', textAlign: 'right' }}>{easySolved}</span>
                <div style={{ display: 'flex', flex: 1, height: '6px', backgroundColor: isDark ? '#2d2d2d' : '#f0f0f0', marginLeft: '10px', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${(easySolved / Math.max(totalSolved, 1)) * 100}%`, height: '100%', backgroundColor: cEasy }} />
                </div>
            </div>

            {/* Row Medium */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: subTextColor, width: '50px' }}>Med.</span>
                <span style={{ fontSize: '14px', fontWeight: 'bold', width: '40px', textAlign: 'right' }}>{mediumSolved}</span>
                <div style={{ display: 'flex', flex: 1, height: '6px', backgroundColor: isDark ? '#2d2d2d' : '#f0f0f0', marginLeft: '10px', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${(mediumSolved / Math.max(totalSolved, 1)) * 100}%`, height: '100%', backgroundColor: cMedium }} />
                </div>
            </div>

             {/* Row Hard */}
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: subTextColor, width: '50px' }}>Hard</span>
                <span style={{ fontSize: '14px', fontWeight: 'bold', width: '40px', textAlign: 'right' }}>{hardSolved}</span>
                <div style={{ display: 'flex', flex: 1, height: '6px', backgroundColor: isDark ? '#2d2d2d' : '#f0f0f0', marginLeft: '10px', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${(hardSolved / Math.max(totalSolved, 1)) * 100}%`, height: '100%', backgroundColor: cHard }} />
                </div>
            </div>
            
            <div style={{ width: '100%', height: '1px', backgroundColor: isDark ? '#333' : '#eee', margin: '4px 0' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: subTextColor }}>Acceptance</span>
                <span style={{ fontWeight: 'bold' }}>{acceptanceRate}%</span>
            </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: subTextColor }}>Global Rank</span>
                <span style={{ fontWeight: 'bold' }}>#{ranking.toLocaleString()}</span>
            </div>

        </div>
    </div>
  );
};
