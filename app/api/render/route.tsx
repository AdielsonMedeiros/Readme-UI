import { templateRegistry } from '@/lib/registry';
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {

    const { searchParams } = new URL(req.url);
    const templateName = searchParams.get('template') || 'spotify';
    
    // Resolve Component
    const Component = templateRegistry[templateName];
    if (!Component) {
      return new Response(`Template "${templateName}" not found. Available: ${Object.keys(templateRegistry).join(', ')}`, { status: 404 });
    }

    // Extract props from query params
    const props: Record<string, any> = {};
    searchParams.forEach((value, key) => {
      if (key === 'template') return;
      if (key === 'accent') {
          props[key] = value;
          return;
      }
      // Simple number parsing
      if (!isNaN(Number(value)) && value.trim() !== '') {
        props[key] = Number(value);
      } else {
        props[key] = value;
      }
    });

    // Setup headers for external API calls
    const token = searchParams.get('token');
    const headers: HeadersInit = {
        'User-Agent': 'Readme-UI-Generator',
        'Accept': 'application/vnd.github.v3+json',
    };
    if (token) {
        headers['Authorization'] = `token ${token}`;
    }

    // --- Special Handler: Animated Typing SVG ---
    if (templateName === 'typing') {
        const lines = (props.lines as string || 'Full Stack Developer|Open Source Enthusiast').split('|');
        const theme = props.theme as string || 'dark';
        const isDark = theme === 'dark';
        const width = Number(props.width) || 600;
        const height = Number(props.height) || 150;
        
        const bgColor = isDark ? '#0d1117' : '#ffffff';
        const textColor = isDark ? '#e6edf3' : '#24292f';
        const accentColor = isDark ? '#58a6ff' : '#0969da';
        const cursorColor = '#1db954';
        
        // Animation settings
        const charDuration = 0.1; // seconds per character
        const linePause = 1.5; // pause between lines
        
        // Cursor Animation Data
        const cursorXValues: number[] = [];
        const cursorYValues: number[] = [];
        const keyTimes: number[] = [];
        
        // SVG Data
        const linesSvg: string[] = [];
        const clipPaths: string[] = [];
        
        let cursorTotalTime = 0;
        
        // Calculate total time first to normalize keyTimes
        const totalAnimationDuration = lines.reduce((acc, line, idx) => {
             const len = line.length;
             return acc + (len * charDuration) + linePause;
        }, 0);

        // Reset for actual generation
        let elapsedTime = 0;

        lines.forEach((line, idx) => {
            const lineId = `line${idx}`;
            const lineLength = line.length;
            const typingDuration = lineLength * charDuration;
            const startTime = elapsedTime;
            
            const fontSize = idx === 0 ? 36 : 24;
            const yPos = 55 + (idx * 40);
            const cursorHeight = fontSize;
            // Adjust cursor Y to be vertically centered on the line
            // Text y is baseline. Rect y is top-left.
            const cursorY = yPos - (cursorHeight * 0.8); 
            
            // Approximate text width
            const charWidth = fontSize * 0.6;
            const textWidth = lineLength * charWidth;
            const startX = (width - textWidth) / 2;
            const endX = startX + textWidth;

            // ClipPath logic (keep existing)
            clipPaths.push(`
                <clipPath id="clip-${lineId}">
                    <rect x="${startX}" y="${yPos - fontSize}" width="0" height="${fontSize + 10}">
                        <animate 
                            attributeName="width" 
                            from="0" 
                            to="${textWidth + 20}" 
                            dur="${typingDuration}s" 
                            begin="${startTime}s" 
                            fill="freeze"
                        />
                    </rect>
                </clipPath>
            `);
            
            // Text Element (keep existing)
            const fontWeight = idx === 0 ? 700 : 500;
            const fillColor = idx === 0 ? textColor : accentColor;
            linesSvg.push(`
                <text 
                    x="${width/2}" 
                    y="${yPos}"
                    text-anchor="middle"
                    font-family="'Segoe UI', Ubuntu, system-ui, -apple-system, sans-serif"
                    font-size="${fontSize}"
                    font-weight="${fontWeight}"
                    fill="${fillColor}"
                    clip-path="url(#clip-${lineId})"
                >
                    ${line}
                </text>
            `);

            // Cursor Logic points
            // 1. Start of line typing
            if (idx === 0) {
                // Initial position at t=0
                cursorXValues.push(startX);
                cursorYValues.push(cursorY);
                keyTimes.push(0);
            } else {
                // This point is "Start of Line N". 
                // We handled the "jump" at the end of the previous iteration's pause.
                // So at this exact time (elapsedTime), we must be at StartX, StartY.
                // However, to ensure continuity from the jump, we just push the start point here.
                // Wait, if we pushed the jump end point in previous iteration at exactly 'elapsedTime', we don't need to push here?
                // Actually, duplicate time is bad. 
                // Let's rely on the previous iteration's "Jump" to have set us at StartX, StartY at exactly startTime.
                // So we don't push anything here? 
                
                // Let's verify:
                // Prev Iteration:
                // ...
                // Push (End0) at (PauseEnd - 1ms)
                // Push (Start1) at (PauseEnd) <-- This is exactly our current 'startTime'
                
                // So yes, the cursor is ALREADY at Start1 at t=startTime.
                // We just need to move to End1.
            }

            // 2. End of line typing
            elapsedTime += typingDuration;
            cursorXValues.push(endX);
            cursorYValues.push(cursorY);
            keyTimes.push(elapsedTime / totalAnimationDuration);

            // 3. Pause
            elapsedTime += linePause;
            
            // If not last line, prepare the jump to the next line
            if (idx < lines.length - 1) {
                const pauseEndTime = elapsedTime;
                const jumpStartTime = pauseEndTime - 0.05; // 50ms before end of pause
                
                // 3a. Hold at end of current line until 50ms before next line
                cursorXValues.push(endX);
                cursorYValues.push(cursorY);
                keyTimes.push(jumpStartTime / totalAnimationDuration);
                
                // 3b. Jump to start of next line at exact start time of next line
                // Calculate next line properties
                const nextIdx = idx + 1;
                const nextLine = lines[nextIdx];
                const nextLineLen = nextLine.length;
                const nextFontSize = nextIdx === 0 ? 36 : 24;
                const nextCharWidth = nextFontSize * 0.6;
                const nextTextWidth = nextLineLen * nextCharWidth;
                const nextStartX = (width - nextTextWidth) / 2;
                const nextYPos = 55 + (nextIdx * 40);
                const nextCursorY = nextYPos - (nextFontSize * 0.8);

                cursorXValues.push(nextStartX);
                cursorYValues.push(nextCursorY);
                keyTimes.push(pauseEndTime / totalAnimationDuration);
            }
        });

        // Ensure we end at 1
        // (If last keyTime is not 1, push the last known position at 1)
        if (keyTimes.length > 0 && keyTimes[keyTimes.length - 1] < 0.999) {
             cursorXValues.push(cursorXValues[cursorXValues.length-1]);
             cursorYValues.push(cursorYValues[cursorYValues.length-1]);
             keyTimes.push(1);
        } else if (keyTimes.length > 0) {
            // Force exact 1.0 at the end to be safe
            keyTimes[keyTimes.length - 1] = 1;
        }

        const cursor = `
            <rect width="3" height="32" fill="${cursorColor}">
                <animate 
                    attributeName="x" 
                    values="${cursorXValues.join(';')}" 
                    keyTimes="${keyTimes.join(';')}"
                    dur="${totalAnimationDuration}s" 
                    fill="freeze" 
                />
                <animate 
                    attributeName="y" 
                    values="${cursorYValues.join(';')}" 
                    keyTimes="${keyTimes.join(';')}"
                    dur="${totalAnimationDuration}s" 
                    fill="freeze" 
                />
                <animate 
                    attributeName="height" 
                    values="${lines.map((_, i) => i === 0 ? 36 : 24).join(';')}" 
                    dur="${totalAnimationDuration}s"
                    fill="freeze"
                    calcMode="discrete"
                />
                <animate 
                    attributeName="opacity" 
                    values="1;0;1" 
                    dur="0.8s" 
                    repeatCount="indefinite" 
                />
            </rect>
        `;
        
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="${bgColor}"/>
    <defs>
        ${clipPaths.join('\n')}
    </defs>
    ${linesSvg.join('\n')}
    ${cursor}
</svg>`;

        return new Response(svg, {
            headers: {
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
        });
    }


    // --- Handler: Snake Game (Authentic GitHub Style) ---
    if (templateName === 'snake') {
        const username = props.username ? String(props.username) : 'AdielsonMedeiros'; 
        const bg = '#0d1117'; 
        const emptyColor = '#161b22';
        const levels = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];

        let gridCells = [];
        let snakePath = "M0,0"; 
        let duration = 10;
        let foods: any[] = [];
        
        const cellW = 10;
        const gap = 3;
        const step = cellW + gap;
        const width = 53 * step + 20; 
        const height = 7 * step + 40; 
        
        let eatenCells = '';

        try {
            // 1. Fetch REAL Contribution Graph
            const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
            
            let contributions: any[] = [];
            
            if (res.ok) {
                const data = await res.json();
                contributions = data.contributions || [];
            } else {
                 const now = new Date();
                 for(let i=0; i<365; i++) {
                     contributions.push({
                         date: new Date(now.getTime() - (364-i)*86400000).toISOString(),
                         count: Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0,
                         level: Math.random() > 0.7 ? Math.floor(Math.random() * 4) : 0
                     });
                 }
            }

            // 2. Build Grid
            const activeDays: {x:number, y:number, count:number, date:string}[] = []; 
            
            for (let col = 0; col < 53; col++) {
                for (let row = 0; row < 7; row++) {
                    const idx = col * 7 + row;
                    const contrib = contributions[idx] || { count: 0, level: 0 };
                    const color = levels[Math.min(contrib.level, 4)] || emptyColor;
                    
                    const x = col * step + 10;
                    const y = row * step + 30;

                    gridCells.push(`<rect x="${x}" y="${y}" width="${cellW}" height="${cellW}" rx="2" fill="${color}" />`);
                    
                    if (contrib.count > 0) {
                    activeDays.push({ x, y, count: contrib.count, date: contrib.date });
                    }
                }
            }

            // 3. Generate Snake Path & Eating Animations (Random Chaos Mode)
            // Fisher-Yates Shuffle for true randomness
            const targets = [...activeDays];
            for (let i = targets.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [targets[i], targets[j]] = [targets[j], targets[i]];
            }
            
            if (targets.length > 0) {
                foods = targets;
                
                // Start Point (Center aligned to first random target)
                let px = targets[0].x - 50; 
                if (px < 0) px = 0;
                let py = targets[0].y;
                
                // M must be CENTERED (+5, +5) matches the rest of the path logic
                let pathStr = [`M${px+5},${py+5}`];
                let totalDistance = 0;
                
                // Map to store the earliest distance at which a target is "hit"
                // Key: "x,y" coordinate string, Value: distance in pixels
                const hitMap = new Map<string, number>();

                const checkCollision = (p1: {x:number, y:number}, p2: {x:number, y:number}, startDist: number) => {
                    const isHoriz = p1.y === p2.y;
                    const isVert = p1.x === p2.x;
                    
                    activeDays.forEach(day => {
                        const key = `${day.x},${day.y}`;
                        // Optimization: If already hit earlier, ignore
                        // logic needed: we want the MINIMUM distance.
                        
                        let hitDist = -1;

                        if (isHoriz && day.y === p1.y) {
                            // Check if x is between p1.x and p2.x
                            const minX = Math.min(p1.x, p2.x);
                            const maxX = Math.max(p1.x, p2.x);
                            if (day.x >= minX && day.x <= maxX) {
                                // Hit! Distance is startDist + distance from p1
                                hitDist = startDist + Math.abs(day.x - p1.x);
                            }
                        } else if (isVert && day.x === p1.x) {
                            // Check if y is between p1.y and p2.y
                            const minY = Math.min(p1.y, p2.y);
                            const maxY = Math.max(p1.y, p2.y);
                            if (day.y >= minY && day.y <= maxY) {
                                hitDist = startDist + Math.abs(day.y - p1.y);
                            }
                        }

                        if (hitDist !== -1) {
                            if (!hitMap.has(key) || hitDist < hitMap.get(key)!) {
                                hitMap.set(key, hitDist);
                            }
                        }
                    });
                };
                
                // Initial check for start point
                checkCollision({x: px, y: py}, {x: px, y: py}, 0);

                targets.forEach((t) => {
                    const currentPos = {x: px, y: py};
                    // Manhattan Movement
                    // 1. Horizontal Move
                    const dH = Math.abs(t.x - px);
                    if (dH > 0) {
                        const nextPos = {x: t.x, y: py};
                        pathStr.push(`L${t.x+5},${py+5}`);
                        checkCollision(currentPos, nextPos, totalDistance);
                        totalDistance += dH;
                        px = t.x; // update X
                    }
                    
                    // 2. Vertical Move
                    const dV = Math.abs(t.y - py);
                    if (dV > 0) {
                        const posAfterH = {x: px, y: py}; // px is already new X, py is old Y
                        const nextPos = {x: px, y: t.y};
                        pathStr.push(`L${t.x+5},${t.y+5}`);
                        checkCollision(posAfterH, nextPos, totalDistance);
                        totalDistance += dV;
                        py = t.y; // update Y
                    }
                });
                
                // Exit Path
                const exitDist = Math.abs(width - px) + 300;
                pathStr.push(`L${width + 300},${py+5}`);
                totalDistance += exitDist;
                
                snakePath = pathStr.join(' ');
                
                // Constant speed 
                const speed = 110; // Faster (was 100)
                duration = totalDistance / speed;
                if (duration < 5) duration = 5; 

                // Generate Eaten Cell Animations using HitMap
                eatenCells = '';
                
                // Iterate over ALL active days, because random path might hit non-targets (if we were sub-selecting)
                // In this case targets = activeDays, but logic holds.
                activeDays.forEach(day => {
                    const key = `${day.x},${day.y}`;
                    const hitDist = hitMap.get(key);
                    
                    if (hitDist !== undefined) {
                        const arrivalPct = hitDist / totalDistance;
                         // Trigger slightly before arrival to account for snake head size
                        let trigger = Math.max(0, arrivalPct - 0.001); 
                        // INSTANT disappearance: finish is trigger + tiny epsilon
                        let finish = trigger + 0.001;
                        
                        // Safety caps
                        if (finish > 0.95) finish = 0.95; 
                        if (trigger >= finish) trigger = finish - 0.0001;

                        eatenCells += `
                            <rect x="${day.x}" y="${day.y}" width="${cellW}" height="${cellW}" rx="2" fill="${bg}" opacity="0">
                                <animate 
                                    attributeName="opacity" 
                                    values="0;0;1;1;0" 
                                    keyTimes="0;${trigger.toFixed(4)};${finish.toFixed(4)};0.98;1" 
                                    dur="${duration}s" 
                                    repeatCount="indefinite" 
                                    calcMode="discrete" 
                                />
                            </rect>
                        `;
                    }
                });
                
            } else {
                 snakePath = "M15,60 L700,60";
                 duration = 20; // Slower fallback
            }

        } catch (e) {
            console.error(e);
            gridCells.push(`<text x="20" y="50" fill="red">Error loading data</text>`);
        }

        // 4. Render Final SVG
        // Create the snake body segments (Head + Body Parts) using the computed path
        // Longer tail: 12 segments
        // Time lag (d) adjusted for speed 110px/s. 
        // We want ~8px gap. 8/110 = ~0.07s.
        const segmentGap = 0.07; 
        const snakeSegments = [];
        
        // Colors from Head to Tail
        const tailColors = [
            '#39d353', '#39d353', '#39d353', // Head area
            '#26a641', '#26a641', '#26a641', // Mid body
            '#006d32', '#006d32', '#006d32', // Lower body
            '#0e4429', '#0e4429', '#0e4429'  // Tail tip
        ];

        for(let i=0; i<12; i++) {
            snakeSegments.push({
                id: `s${i}`,
                c: tailColors[i] || '#0e4429',
                o: Math.max(0.4, 1 - (i * 0.05)), // Gradual opacity fade
                d: i * segmentGap
            });
        }
        
        const snakeEls = snakeSegments.reverse().map(s => `
             <rect x="-5" y="-5" width="${cellW}" height="${cellW}" rx="2" fill="${s.c}" opacity="${s.o}">
                <animateMotion path="${snakePath}" dur="${duration}s" begin="${s.d}s" repeatCount="indefinite" calcMode="linear" />
            </rect>
        `).join('\n');

        const svg = `
            <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="${bg}" rx="6" />
                <text x="10" y="20" font-family="sans-serif" font-size="12" fill="#8b949e"> Contribution Snake for ${username}</text>
                
                <g>${gridCells.join('')}</g>
                <g>${eatenCells}</g> 
                ${snakeEls}
            </svg>
        `;
         return new Response(svg, { 
             headers: { 
                 'Content-Type': 'image/svg+xml',
                 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                 'Pragma': 'no-cache',
                 'Expires': '0',
             } 
         });
    }

    // --- Dynamic Data Fetching for other templates ---

    // Hacking Terminal
    if (templateName === 'hacking' && props.username) {
        const username = String(props.username);
        try {
            const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=5`, { headers });
            if (reposRes.ok) {
                const reposData = await reposRes.json();
                props.repos = reposData.map((r: any) => r.name);
            }
        } catch (e) { console.error(e); }
    }

    // Weather Widget
    if (templateName === 'weather' && props.city) {
        try {
            const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(String(props.city))}&count=1&language=en&format=json`);
            if (geoRes.ok) {
                const geoData = await geoRes.json();
                if (geoData.results?.length > 0) {
                    const { latitude, longitude, name } = geoData.results[0];
                    props.city = name;
                    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,weather_code&timezone=auto`);
                    if (weatherRes.ok) {
                        const wData = await weatherRes.json();
                        props.temperature = wData.current.temperature_2m;
                        props.isDay = wData.current.is_day === 1;
                        const code = wData.current.weather_code;
                        let cond = "Clear";
                        if (code >= 1 && code <= 3) cond = "Partly Cloudy";
                        if (code >= 45 && code <= 48) cond = "Foggy";
                        if (code >= 51 && code <= 67) cond = "Rainy";
                        if (code >= 71) cond = "Snow";
                        if (code >= 95) cond = "Storm";
                        props.condition = cond;
                    }
                }
            }
        } catch (e) { console.error(e); }
    }

    // Project Showcase
    if (templateName === 'project' && props.repo) {
        try {
            const repoPath = String(props.repo);
            const headers: HeadersInit = { 'User-Agent': 'Readme-UI' };
            if (props.token) headers['Authorization'] = `Bearer ${props.token}`;
            
            const repoRes = await fetch(`https://api.github.com/repos/${repoPath}`, { headers });
            if (repoRes.ok) {
                const data = await repoRes.json();
                props.name = data.name;
                props.description = data.description || 'No description';
                props.stars = data.stargazers_count;
                props.forks = data.forks_count;
                props.language = data.language || 'Unknown';
            }
        } catch (e) { console.error(e); }
    }

    // Visitors
    if (templateName === 'visitors' && props.username) {
        try {
            const username = String(props.username);
            const headers: HeadersInit = { 'User-Agent': 'Readme-UI' };
            if (props.token) headers['Authorization'] = `Bearer ${props.token}`;
            
            const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
            if (userRes.ok) {
                const userData = await userRes.json();
                props.count = userData.followers + userData.public_repos;
                props.label = props.label || 'Profile Engagement';
            }
        } catch (e) { console.error(e); }
    }

    // Spotify
    if (templateName === 'spotify' && props.coverUrl) {
        try {
           const coverUrlStr = decodeURIComponent(String(props.coverUrl));
           const coverRes = await fetch(coverUrlStr, { headers: { 'User-Agent': 'Readme-UI/1.0' } });
            if (coverRes.ok) {
                const arrayBuffer = await coverRes.arrayBuffer();
                const uint8Array = new Uint8Array(arrayBuffer);
                let binaryString = '';
                for (let i = 0; i < uint8Array.length; i++) binaryString += String.fromCharCode(uint8Array[i]);
                const base64 = btoa(binaryString);
                props.coverUrl = `data:image/jpeg;base64,${base64}`;
            }
        } catch (e) { console.error(e); delete props.coverUrl; }
    }

    // GitHub Stats
    if (templateName === 'github' && props.username) {
        try {
            const headers: HeadersInit = { 'User-Agent': 'Readme-UI', 'Accept': 'application/vnd.github.mercy-preview+json' };
            if (props.token) headers['Authorization'] = `Bearer ${props.token}`;

            const ghRes = await fetch(`https://api.github.com/users/${props.username}`, { headers });
            if (ghRes.ok) {
                const ghData = await ghRes.json();
                props.name = ghData.name || ghData.login;
                props.followers = ghData.followers;
                props.avatarUrl = ghData.avatar_url;
                props.repos = ghData.public_repos;
                props.location = ghData.location;
                props.bio = ghData.bio;
                props.company = ghData.company;
                props.blog = ghData.blog;
                props.joinedDate = new Date(ghData.created_at).getFullYear().toString();

                try {
                    const reposRes = await fetch(`https://api.github.com/users/${props.username}/repos?per_page=100&type=owner&sort=updated`, { headers });
                    if (reposRes.ok) {
                        const repos = await reposRes.json();
                        props.stars = repos.reduce((acc: number, r: any) => acc + (r.stargazers_count || 0), 0);
                        props.forks = repos.reduce((acc: number, r: any) => acc + (r.forks_count || 0), 0);
                        
                        const totalSizeKB = repos.reduce((acc: number, r: any) => acc + (r.size || 0), 0);
                        if (totalSizeKB > 1024 * 1024) props.size = (totalSizeKB / (1024 * 1024)).toFixed(1) + ' GB';
                        else if (totalSizeKB > 1024) props.size = (totalSizeKB / 1024).toFixed(1) + ' MB';
                        else props.size = totalSizeKB + ' KB';

                        const langMap: Record<string, number> = {};
                        repos.forEach((r: any) => { if(r.language) langMap[r.language] = (langMap[r.language]||0)+1; });
                        const topLangs = Object.entries(langMap).sort(([,a],[,b])=>b-a).slice(0,4).map(([name, count]) => ({name, count}));
                        props.languages = JSON.stringify(topLangs);
                    }
                } catch(e) { console.error(e); }
                
                 try {
                    const [prsRes, issuesRes, orgsRes] = await Promise.all([
                        fetch(`https://api.github.com/search/issues?q=type:pr+author:${props.username}`, { headers }),
                        fetch(`https://api.github.com/search/issues?q=type:issue+author:${props.username}`, { headers }),
                        fetch(`https://api.github.com/users/${props.username}/orgs`, { headers })
                    ]);
                    if (prsRes.ok) props.prs = (await prsRes.json()).total_count;
                    if (issuesRes.ok) props.issues = (await issuesRes.json()).total_count;
                    if (orgsRes.ok) props.orgs = (await orgsRes.json()).length;
                    
                    if (props.token) {
                         const query = `query($login: String!) { user(login: $login) { contributionsCollection { contributionCalendar { totalContributions } } } }`;
                         const gqlRes = await fetch('https://api.github.com/graphql', {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${props.token}`,
                                    'Content-Type': 'application/json',
                                    'User-Agent': 'Readme-UI'
                                },
                                body: JSON.stringify({ query, variables: { login: props.username } })
                            });
                         if (gqlRes.ok) {
                             const gqlData = await gqlRes.json();
                             props.totalCommits = gqlData.data?.user?.contributionsCollection?.contributionCalendar?.totalContributions || "500+";
                         }
                    } else {
                         props.totalCommits = "500+";
                    }
                } catch(e) { console.error(e); }
            }
        } catch (e) { console.error(e); }
    }

    // --- Handler: 3D Activity Graph ---
    if (templateName === 'activity') {
        const username = props.username ? String(props.username) : 'AdielsonMedeiros';
        try {
            const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
            if (res.ok) {
                const data = await res.json();
                // Pass the last 150 days to avoid cluttering the 3D view too much, or filter as needed handled in component
                props.contributions = data.contributions; 
            }
        } catch (e) {
            console.error('Activity Graph Fetch Error:', e);
        }
    }

    // Default: Render React Component to SVG (ImageResponse)
    
    // Load Font (Instrument Sans) - with fallback
    let fontData: ArrayBuffer | null = null;
    try {
        const fontUrl = 'https://cdn.jsdelivr.net/npm/@fontsource/instrument-sans@5.1.0/files/instrument-sans-latin-400-normal.woff';
        const fontRes = await fetch(fontUrl);
        if (fontRes.ok) {
            fontData = await fontRes.arrayBuffer();
        } 
    } catch (fontErr) { console.warn('Font loading error:', fontErr); }

    const width = Number(searchParams.get('width')) || 800;
    const height = Number(searchParams.get('height')) || 400;

    try {
        const options: any = { width, height };

        if (fontData) {
            options.fonts = [{
                name: 'Instrument Sans',
                data: fontData,
                style: 'normal',
            }];
        }

        return new ImageResponse(
            <Component {...props} />,
            options
        );
    } catch (renderErr: any) {
        console.error('Render error:', renderErr);
        return new ImageResponse(
            (
                <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: '#000', color: '#fff', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                    Render Error: {renderErr.message}
                </div>
            ),
            { width, height }
        );
    }
}

