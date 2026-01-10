import { templateRegistry } from '@/lib/registry';
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import satori from 'satori';



const generateErrorResponse = (message: string, width: number, height: number, format: string | null) => {
    // Styling for error container
    const errorStyle = `
        display: flex;
        width: 100%;
        height: 100%;
        background-color: #0d1117;
        color: #ff5555;
        align-items: center;
        justify-content: center;
        font-family: monospace;
        font-size: 14px;
        padding: 20px;
        text-align: center;
        border: 1px solid #30363d;
        border-radius: 8px;
        box-sizing: border-box;
    `;

    if (format === 'svg') {
         const svgError = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <foreignObject width="100%" height="100%">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="${errorStyle}">
                        <div style="max-width: 100%; word-wrap: break-word;">
                            <h3 style="margin: 0 0 8px 0; color: #ff5555; font-size: 16px;">Generation Error</h3>
                            <p style="margin: 0; color: #8b949e; line-height: 1.4;">${message}</p>
                        </div>
                    </div>
                </foreignObject>
            </svg>
        `;
        return new Response(svgError, {
            headers: {
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'no-store, must-revalidate'
            }
        });
    }

    return new ImageResponse(
        (
            <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: '#0d1117', color: '#ff5555', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', flexDirection: 'column', padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 18, marginBottom: 8, fontWeight: 'bold' }}>Generation Error</div>
                <div style={{ fontSize: 14, color: '#8b949e' }}>{message}</div>
            </div>
        ),
        { 
            width, 
            height,
            headers: { 'Cache-Control': 'no-store, must-revalidate' }
        }
    );
};

const checkGitHubError = (res: Response) => {
    if (!res.ok) {
        if (res.status === 403 || res.status === 429) {
             throw new Error("GitHub API Rate Limit Exceeded. Please add a Token in the configuration.");
        }
        if (res.status === 401) {
             throw new Error("Invalid GitHub Token. Please check your credentials.");
        }
        if (res.status === 404) {
             throw new Error("GitHub Resource not found. Check username/repo.");
        }
    }
};

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
    // PRIORITY: Query Param > Env Var. 
    // WARNING: Query params are public in READMEs. Use env var in production!
    const token = searchParams.get('token') || process.env.GITHUB_TOKEN;
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

    // --- Handler: Music Visualizer (Animated SVG) ---
    // Note: Re-implemented manually as SVG because ImageResponse does not support CSS animations
    if (templateName === 'music') {
        const width = Number(props.width) || 600;
        const height = Number(props.height) || 150;
        const barColor = String(props.barColor || '#1db954');
        const track = String(props.trackName || 'Midnight City');
        const artist = String(props.artist || 'M83');
        const theme = String(props.theme || 'dark');
        const isDark = theme === 'dark';
        const bg = isDark ? '#0d1117' : '#ffffff';
        const textMain = isDark ? '#e6edf3' : '#24292f';
        const textSub = isDark ? '#8b949e' : '#586069';
        const borderColor = isDark ? '#30363d' : '#e1e4e8';

        // Dimensions
        const padding = 24;
        const coverSize = 80;
        const contentLeft = padding + coverSize + 16;
        const baseY = padding + coverSize; // Bottom of cover

        // Generate 35 animated bars
        const bars: string[] = [];
        for (let i = 0; i < 35; i++) {
            const maxH = 35; 
            const minH = 4;
            const dur = 0.7 + Math.random() * 0.5; // Random duration between 0.7s and 1.2s
            const startX = contentLeft + (i * 9); // 6px bar + 3px gap
            
            // Random animation height target
            const targetH = minH + Math.random() * (maxH - minH);
            
            // Calc Y positions for bottom-alignment
            // y goes UP as height increases
            const yMin = baseY - minH;
            const yMax = baseY - targetH;

            bars.push(`
                <rect x="${startX}" y="${yMin}" width="6" height="${minH}" fill="${barColor}" rx="2" opacity="0.9">
                    <animate attributeName="height" values="${minH};${targetH};${minH}" dur="${dur}s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1; 0.5 0 0.5 1" />
                    <animate attributeName="y" values="${yMin};${yMax};${yMin}" dur="${dur}s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1; 0.5 0 0.5 1" />
                </rect>
            `);
        }

        const svg = `
            <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
                <style>
                    .track { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; font-weight: 600; font-size: 20px; fill: ${textMain}; }
                    .artist { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; font-weight: 400; font-size: 15px; fill: ${textSub}; }
                </style>
                
                <rect width="100%" height="100%" fill="${bg}" rx="12" stroke="${borderColor}" stroke-width="1"/>
                
                <!-- Album Cover -->
                <rect x="${padding}" y="${padding}" width="${coverSize}" height="${coverSize}" rx="6" fill="#21262d" />
                <!-- Generic Music Note Icon -->
                <text x="${padding + 40}" y="${padding + 48}" font-size="32" text-anchor="middle" dominant-baseline="middle" fill="#8b949e">🎵</text>

                <!-- Text Info -->
                <text x="${contentLeft}" y="${padding + 25}" class="track">${track}</text>
                <text x="${contentLeft}" y="${padding + 50}" class="artist">${artist}</text>

                <!-- Visualizer Bars -->
                <g>
                    ${bars.join('\n')}
                </g>
            </svg>
        `;

        return new Response(svg, { 
            headers: { 
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            } 
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

    // --- Handler: Hacking Terminal (Animated) ---
    if (templateName === 'hacking') {
        const username = props.username ? String(props.username) : 'User';
        let repoNames: string[] = ['sys-core', 'auth-module', 'neural-net'];

        // Fetch real repos
        try {
            const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=3`, { headers });
            checkGitHubError(reposRes);
            if (reposRes.ok) {
                const reposData = await reposRes.json();
                if (reposData.length > 0) {
                     repoNames = reposData.map((r: any) => r.name);
                }
            }
        } catch (e: any) { 
            if (e.message?.includes('GitHub')) {
                return generateErrorResponse(e.message, Number(props.width)||600, Number(props.height)||350, searchParams.get('format'));
            }
            console.error('Hacking Repo Fetch Error:', e); 
        }

        const width = Number(props.width) || 600;
        const height = Number(props.height) || 350;
        
        // Aesthetic Configuration
        const bg = '#050505';
        const cardBg = '#0c0c0c';
        const borderColor = '#333333';
        const textGreen = '#4af626';
        const successGreen = '#ffffff'; // White for success standout or just bold green
        
        // Font settings
        const fontSize = 14;
        const lineHeight = 20;
        const fontFamily = 'Consolas, Monaco, monospace';
        
        // Positioning
        const startX = 40;
        const startY = 70; // Header takes up space
        
        // Sequence generation
        const sequence = [
            { text: '> INITIALIZING_CONNECTION...', delay: 0 },
            { text: `> TARGET: ${username}@github.com`, delay: 0.8 },
            { text: '> BYPASSING_FIREWALL... ', delay: 1.6, suffix: '[SUCCESS]', suffixDelay: 2 },
            { text: '> ACCESSING_MAINFRAME...', delay: 3.5 },
            { text: '> FETCHING_REPOSITORIES...', delay: 4.2 },
            // Repos
            ...repoNames.map((r, i) => ({ text: `> DOWNLOADING_SOURCE: ${r}...`, delay: 5.0 + (i * 0.4) })),
            { text: '> COMPILING_ASSETS...', delay: 6.5 },
            { text: '> DEPLOYING_TO_PRODUCTION...', delay: 7.2 },
            { text: '> SYSTEM_READY', delay: 8.0 }
        ];

        // Generate SVG Text Lines
        const textElements = sequence.map((item, idx) => {
            const y = startY + (idx * lineHeight);
            
            // Standard line animation
            const mainAnim = `
                <animate 
                    attributeName="opacity" 
                    from="0" 
                    to="1" 
                    begin="${item.delay}s" 
                    dur="0.1s" 
                    fill="freeze" 
                />
            `;

            let content = item.text;
            let suffixEl = '';
            
            if (item.suffix) {
                // If there's a suffix like [SUCCESS] that appears later
                // We render the main text, and a separate span for the suffix
                // SVG <text> doesn't support <span> easily without tspan hell.
                // Easier: Two separate text elements? Or tspan.
                // Let's use tspan.
                
                // Note: tspan x can be relative? No, let's just make the suffix its own text element or tspan with absolute positioning assumption or simple flow
                // Simple flow in SVG text is hard.
                // Hack: Just write the whole line but animate the suffix opacity?
                // Better: Split into two parts visually. 
                // "BYPASSING_FIREWALL... " + "[SUCCESS]"
                // We estimate width of part 1? Monospace font helps.
                // Approx char width ~ 8.4px for 14px Consolas
                const charW = fontSize * 0.61; 
                const part1Width = item.text.length * charW;
                
                content = item.text;
                
                suffixEl = `
                    <text x="${startX + part1Width}" y="${y}" fill="${successGreen}" font-size="${fontSize}" font-family="${fontFamily}" font-weight="bold" opacity="0">
                        ${item.suffix}
                        <animate attributeName="opacity" from="0" to="1" begin="${item.suffixDelay}s" dur="0.1s" fill="freeze" />
                    </text>
                `;
            }

            return `
                <text x="${startX}" y="${y}" fill="${textGreen}" font-size="${fontSize}" font-family="${fontFamily}" opacity="0">
                    ${content}
                    ${mainAnim}
                </text>
                ${suffixEl}
            `;
        });
        
        // Blinking Cursor Logic
        // Appears after last line
        const lastValues = sequence[sequence.length-1];
        const lastLineY = startY + (sequence.length * lineHeight);
        const cursorDelay = lastValues.delay + 0.5;
        
        const cursorSvg = `
            <g opacity="0">
                <animate attributeName="opacity" from="0" to="1" begin="${cursorDelay}s" dur="0.1s" fill="freeze" />
                <text x="${startX}" y="${lastLineY}" fill="#fff" font-size="${fontSize}" font-family="${fontFamily}">$</text>
                <rect x="${startX + 15}" y="${lastLineY - 10}" width="10" height="15" fill="${textGreen}">
                    <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" />
                </rect>
            </g>
        `;

        const svg = `
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
            <style>
                .terminal-text { font-family: Consolas, Monaco, 'Courier New', monospace; }
            </style>
            
            <!-- Bg -->
            <rect width="100%" height="100%" fill="${bg}" />
            
            <!-- Window Card -->
            <rect x="10" y="10" width="${width - 20}" height="${height - 20}" rx="10" fill="${cardBg}" stroke="${borderColor}" stroke-width="1" />
            
            <!-- Window Header -->
            <rect x="11" y="11" width="${width - 22}" height="32" rx="10" fill="#111" />
            <!-- Flatten bottom radius of header -->
            <rect x="11" y="30" width="${width - 22}" height="15" fill="#111" />
            <line x1="10" y1="43" x2="${width - 10}" y2="43" stroke="${borderColor}" stroke-width="1" />
            
            <!-- Buttons -->
            <circle cx="35" cy="27" r="6" fill="#ff5f56" />
            <circle cx="55" cy="27" r="6" fill="#ffbd2e" />
            <circle cx="75" cy="27" r="6" fill="#27c93f" />
            
            <!-- Title -->
            <text x="${width / 2}" y="31" text-anchor="middle" fill="#666" font-size="12" font-family="sans-serif">bash — ${username}</text>
            
            <!-- Content -->
            <g class="terminal-text" style="filter: drop-shadow(0 0 2px rgba(74, 246, 38, 0.4));">
                ${textElements.join('\n')}
                ${cursorSvg}
            </g>

        </svg>
        `;

        return new Response(svg, {
            headers: {
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
        });
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
            checkGitHubError(repoRes);
            if (repoRes.ok) {
                const data = await repoRes.json();
                props.name = data.name;
                props.description = data.description || 'No description';
                props.stars = data.stargazers_count;
                props.forks = data.forks_count;
                props.language = data.language || 'Unknown';
            }
        } catch (e: any) { 
            if (e.message?.includes('GitHub')) {
                return generateErrorResponse(e.message, Number(props.width)||400, Number(props.height)||150, searchParams.get('format'));
            }
            console.error(e); 
        }
    }

    // Visitors
    if (templateName === 'visitors' && props.username) {
        try {
            const username = String(props.username);
            const headers: HeadersInit = { 'User-Agent': 'Readme-UI' };
            if (props.token) headers['Authorization'] = `Bearer ${props.token}`;
            
            const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
            checkGitHubError(userRes);
            if (userRes.ok) {
                const userData = await userRes.json();
                props.count = userData.followers + userData.public_repos;
                props.label = props.label || 'Profile Engagement';
            }
        } catch (e: any) { 
            if (e.message?.includes('GitHub')) {
                return generateErrorResponse(e.message, Number(props.width)||400, Number(props.height)||100, searchParams.get('format'));
            }
            console.error(e); 
        }
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
            checkGitHubError(ghRes);
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
        } catch (e: any) { 
            if (e.message?.includes('GitHub')) {
                return generateErrorResponse(e.message, Number(props.width)||460, Number(props.height)||200, searchParams.get('format'));
            }
            console.error(e); 
        }
    }

    // Stack Icons Pre-fetching
    if (templateName === 'stack' && props.skills) {
        try {
            const skillList = String(props.skills).split(',').map(s => s.trim()).filter(Boolean);
            const iconMap: Record<string, string> = {};

            // Get theme to decide fallback color logic
            const isDark = (props.theme !== 'light');

            await Promise.all(skillList.map(async (rawSkill) => {
                const skill = rawSkill.trim();
                // Robust slug normalization for CDNs
                const slug = skill.toLowerCase()
                     .replace(/\+/g, 'plus')
                     .replace(/#/g, 'sharp')
                     .replace(/\./g, 'dot'); 
                
                let svgContent = '';
                try {
                    const headers = { 'User-Agent': 'Mozilla/5.0 (compatible; Readme-UI)' };
                    
                    // 1. Try SimpleIcons CDN (Preferred - Colors)
                    let res = await fetch(`https://cdn.simpleicons.org/${slug}`, { headers });
                    
                    if (res.ok) {
                        svgContent = await res.text();
                    } else {
                        // 2. Fallback to JSDelivr (Reliable - Monochrome)
                        const fallbackUrl = `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${slug}.svg`;
                        res = await fetch(fallbackUrl, { headers });
                        if (res.ok) {
                            svgContent = await res.text();
                            // Invert color for dark mode if using monochrome fallback
                            if (isDark && svgContent.includes('<svg')) {
                                svgContent = svgContent.replace('<svg', '<svg fill="#ffffff"');
                            }
                        }
                    }
                } catch (err) {
                    console.error(`[Stack] Error ${slug}`, err);
                }

                if (svgContent && svgContent.includes('<svg')) {
                     const base64 = Buffer.from(svgContent).toString('base64');
                     // Use original skill key for frontend mapping
                     iconMap[skill] = `data:image/svg+xml;base64,${base64}`;
                }
            }));

            
            props.iconMap = iconMap;
        } catch (e) { console.error('Stack Icon Setup Error', e); }
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

    // --- Handler: LeetCode Stats ---
    if (templateName === 'leetcode') {
        const username = props.username ? String(props.username) : 'AdielsonMedeiros'; // or 'adielson' if that's his leetcode
        try {
            // Using reliable proxy for edge compatibility
            const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
            if (res.ok) {
                const data = await res.json();
                if (data.status === 'success') {
                     props.ranking = data.ranking;
                     props.totalSolved = data.totalSolved;
                     props.totalQuestions = data.totalQuestions;
                     props.easySolved = data.easySolved;
                     props.mediumSolved = data.mediumSolved;
                     props.hardSolved = data.hardSolved;
                     props.acceptanceRate = data.acceptanceRate;
                }
            }
        } catch (e) {
            console.error('LeetCode Fetch Error:', e);
        }
    }

    // --- Handler: WakaTime Stats ---
    if (templateName === 'wakatime') {
        const username = props.username ? String(props.username) : 'AdielsonMedeiros';
        // Note: WakaTime requires a public profile usually, or an API key.
        // We will try fetching the public stats JSON if available, otherwise mock for demo/failure fallback.
        try {
            // This is a publicly available proxy/wrapper often used, or we can use wakatime's own if publicly enabled
            // "https://wakatime.com/api/v1/users/${username}/stats" requires Auth usually.
            // Let's rely on standard PROPS passed in, or fetch from a known wrapper if needed.
            // For now, we'll try a common open source compatible endpoint layout or just fallback if not provided.
             
             // NOTE: Since WakaTime is strict about CORS and Auth, fully dynamic fetching without a backend proxy with KEY is hard.
             // We will implement a "best effort" with a timeout. If user passed specific data in query params (like &typescript=50), we use that.
             // Otherwise, without an API Key stored in ENV, we can't reliably fetch random users private stats.
             // HOWEVER: Wakatime has "Share your coding activity" features which give a public JSON url.
             // IF props.api_url is provided, we use it.
             
             if (props.api_url) {
                 const wRes = await fetch(props.api_url);
                 if (wRes.ok) {
                     const wData = await wRes.json();
                     const data = wData.data;
                     if(data) {
                         props.totalTime = data.human_readable_total_including_other_language;
                         props.dailyAverage = data.human_readable_daily_average_including_other_language;
                         props.languages = data.languages.slice(0,5).map((l:any) => ({
                             name: l.name,
                             percent: l.percent,
                             time: l.text,
                             color: l.color // WakaTime doesn't always send color in all endpoints, need map fallback if missing
                         }));
                     }
                 }
             }
        } catch (e) { console.error('WakaTime Fetch Error', e); }
    }



    // --- Handler: Goodreads (Currently Reading) ---
    // If goodreadsId is provided, fetching from public RSS feed.
    const goodreadsId = props.goodreadsId || searchParams.get('goodreadsId');
    if (templateName === 'goodreads' && goodreadsId) {
        try {
             // https://www.goodreads.com/review/list_rss/USER_ID?shelf=currently-reading
             const feedUrl = `https://www.goodreads.com/review/list_rss/${goodreadsId}?shelf=currently-reading`;
             const rssRes = await fetch(feedUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
             
             if(rssRes.ok) {
                 const text = await rssRes.text();
                 
                 // Simple regex extraction for the FIRST item in the feed
                 const itemMatch = text.match(/<item>([\s\S]*?)<\/item>/);
                 if (itemMatch && itemMatch[1]) {
                     const itemContent = itemMatch[1];
                     
                     // Extract Title
                     const titleMatch = itemContent.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || itemContent.match(/<title>(.*?)<\/title>/);
                     if (titleMatch) props.title = titleMatch[1];

                     // Extract Author
                     const authorMatch = itemContent.match(/<author_name><!\[CDATA\[(.*?)\]\]><\/author_name>/) || itemContent.match(/<author_name>(.*?)<\/author_name>/);
                     if (authorMatch) props.author = authorMatch[1];

                     // Extract Image (prefer large)
                     const imgMatch = itemContent.match(/<book_large_image_url><!\[CDATA\[(.*?)\]\]><\/book_large_image_url>/) || 
                                      itemContent.match(/<book_image_url><!\[CDATA\[(.*?)\]\]><\/book_image_url>/) ||
                                      itemContent.match(/<book_large_image_url>(.*?)<\/book_large_image_url>/) ||
                                      itemContent.match(/<book_image_url>(.*?)<\/book_image_url>/);
                     
                     if (imgMatch) props.coverUrl = imgMatch[1];

                     // RSS doesn't reliably give progress %. 
                     // We set it to undefined to indicate "Just Reading" state in UI.
                     props.progress = undefined; 
                 }
             }
        } catch(e) {
            console.error('Goodreads RSS Fetch Error', e);
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
        const options: any = { 
            width, 
            height,
            headers: {
                'Cache-Control': 'public, max-age=14400, s-maxage=14400, stale-while-revalidate=600',
            }
        };

        if (fontData) {
            options.fonts = [{
                name: 'Instrument Sans',
                data: fontData,
                style: 'normal',
            }];
        }

        const format = searchParams.get('format');
        if (format === 'svg' && fontData) {
            const svg = await satori(
                <Component {...props} />,
                {
                    width,
                    height,
                    fonts: [{
                        name: 'Instrument Sans',
                        data: fontData,
                        style: 'normal'
                    }]
                }
            );
            return new Response(svg, {
                headers: {
                    'Content-Type': 'image/svg+xml',
                    'Cache-Control': 'public, max-age=14400, s-maxage=14400, stale-while-revalidate=600',
                }
            });
        }

        return new ImageResponse(
            <Component {...props} />,
            options
        );
    } catch (renderErr: any) {
        console.error('Render error:', renderErr);
        
        const format = searchParams.get('format');
        const errorMessage = renderErr.message || 'Unknown Error';

        // Styling for error container
        const errorStyle = `
            display: flex;
            width: 100%;
            height: 100%;
            background-color: #0d1117;
            color: #ff5555;
            align-items: center;
            justify-content: center;
            font-family: monospace;
            font-size: 16px;
            padding: 20px;
            text-align: center;
            border: 1px solid #30363d;
            border-radius: 8px;
        `;

        if (format === 'svg') {
            // Return raw SVG for errors if requested format is SVG
             const svgError = `
                <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                    <foreignObject width="100%" height="100%">
                        <div xmlns="http://www.w3.org/1999/xhtml" style="${errorStyle}">
                            <div>
                                <h3 style="margin: 0 0 8px 0; color: #ff5555;">Generation Error</h3>
                                <p style="margin: 0; color: #8b949e;">${errorMessage}</p>
                            </div>
                        </div>
                    </foreignObject>
                </svg>
            `;
            return new Response(svgError, {
                headers: {
                    'Content-Type': 'image/svg+xml',
                    'Cache-Control': 'no-store, must-revalidate'
                }
            });
        }

        return new ImageResponse(
            (
                <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: '#0d1117', color: '#ff5555', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', flexDirection: 'column', padding: 20, textAlign: 'center' }}>
                    <div style={{ fontSize: 18, marginBottom: 8, fontWeight: 'bold' }}>Generation Error</div>
                    <div style={{ fontSize: 14, color: '#8b949e' }}>{errorMessage}</div>
                </div>
            ),
            { 
                width, 
                height,
                headers: {
                    'Cache-Control': 'no-store, must-revalidate'
                }
            }
        );
    }
}

