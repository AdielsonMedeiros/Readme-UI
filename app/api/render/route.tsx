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
    const props: Record<string, string | number> = {};
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

    // --- Special Handler: Animated Typing SVG ---
    if (templateName === 'typing') {
        const lines = (props.lines as string || 'Full Stack Developer|Open Source Enthusiast').split('|');
        const theme = props.theme as string || 'dark';
        const isDark = theme === 'dark';
        const width = Number(props.width) || 600;
        const height = Number(props.height) || 100;
        
        const textColor = isDark ? '#e6edf3' : '#24292f';
        const accentColor = isDark ? '#58a6ff' : '#0969da';
        const cursorColor = '#1db954';
        
        // Calculate animation timings
        const charsPerSecond = 10;
        const pauseBetweenLines = 1.5; // seconds
        
        let totalDuration = 0;
        const lineAnimations = lines.map((line, i) => {
            const typeDuration = line.length / charsPerSecond;
            const startTime = totalDuration;
            totalDuration += typeDuration + pauseBetweenLines;
            return { line, startTime, typeDuration };
        });
        
        // Generate SVG with CSS animations
        const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <style>
    @keyframes typing {
      from { width: 0; }
      to { width: 100%; }
    }
    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .line {
      font-family: 'Segoe UI', Ubuntu, Sans-Serif;
      font-weight: 600;
      fill: ${textColor};
    }
    .line-0 { font-size: 28px; fill: ${textColor}; }
    .line-1 { font-size: 20px; fill: ${accentColor}; }
    .cursor {
      animation: blink 0.7s infinite;
      fill: ${cursorColor};
    }
    .typing-container {
      overflow: hidden;
      display: inline-block;
      animation: typing 2s steps(40) forwards;
    }
  </style>
  
  ${isDark ? '' : '<rect width="100%" height="100%" fill="#ffffff"/>'}
  
  <g transform="translate(${width/2}, ${height/2})">
    ${lines.map((line, i) => `
      <text 
        class="line line-${i}" 
        text-anchor="middle" 
        y="${i === 0 ? -10 : 20}"
        style="animation: fadeIn 0.5s ease ${i * 0.5}s forwards; opacity: 0;"
      >
        ${line}
      </text>
    `).join('')}
    
    <!-- Cursor -->
    <rect 
      class="cursor" 
      x="${Math.max(...lines.map(l => l.length)) * 4}" 
      y="${lines.length > 1 ? 5 : -25}" 
      width="3" 
      height="24"
    />
  </g>
</svg>`;

        return new Response(svg, {
            headers: {
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
        });
    }

    // --- Dynamic Data Fetching ---

    // Project Showcase: Fetch real repo data from GitHub
    if (templateName === 'project' && props.repo) {
        try {
            const repoPath = String(props.repo); // format: "username/repo-name"
            const headers: HeadersInit = { 'User-Agent': 'Readme-UI' };
            if (props.token) {
                headers['Authorization'] = `Bearer ${props.token}`;
            }
            
            const repoRes = await fetch(`https://api.github.com/repos/${repoPath}`, { headers });
            
            if (repoRes.ok) {
                const data = await repoRes.json();
                props.name = data.name;
                props.description = data.description || 'No description';
                props.stars = data.stargazers_count;
                props.forks = data.forks_count;
                props.language = data.language || 'Unknown';
                
                // Language colors mapping
                const langColors: Record<string, string> = {
                    'TypeScript': '#3178c6',
                    'JavaScript': '#f1e05a',
                    'Python': '#3572A5',
                    'Java': '#b07219',
                    'Go': '#00ADD8',
                    'Rust': '#dea584',
                    'Ruby': '#701516',
                    'PHP': '#4F5D95',
                    'C#': '#178600',
                    'C++': '#f34b7d',
                    'C': '#555555',
                    'Swift': '#F05138',
                    'Kotlin': '#A97BFF',
                };
                props.languageColor = langColors[data.language] || '#8b949e';
            }
        } catch (e) {
            console.error('[Project] Failed to fetch repo data:', e);
        }
    }

    // Visitor Counter: Fetch real stats from GitHub profile
    if (templateName === 'visitors' && props.username) {
        try {
            const username = String(props.username);
            const headers: HeadersInit = { 'User-Agent': 'Readme-UI' };
            if (props.token) {
                headers['Authorization'] = `Bearer ${props.token}`;
            }
            
            // Fetch user profile to get followers as "views" proxy
            const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
            
            if (userRes.ok) {
                const userData = await userRes.json();
                // Use followers + public repos as engagement metric
                props.count = userData.followers + userData.public_repos;
                props.label = props.label || 'Profile Engagement';
            }
        } catch (e) {
            console.error('[Visitors] Failed to fetch profile data:', e);
        }
    }

    // Spotify: Fetch cover image server-side to avoid CORS issues
    if (templateName === 'spotify' && props.coverUrl) {
        try {
            // Ensure URL is properly decoded (searchParams should handle this, but let's be safe)
            const coverUrlStr = decodeURIComponent(String(props.coverUrl));
            console.log('[Spotify] Fetching cover from:', coverUrlStr);
            
            const coverRes = await fetch(coverUrlStr, {
                headers: { 'User-Agent': 'Readme-UI/1.0' }
            });
            
            console.log('[Spotify] Cover response status:', coverRes.status);
            
            if (coverRes.ok) {
                const arrayBuffer = await coverRes.arrayBuffer();
                const uint8Array = new Uint8Array(arrayBuffer);
                let binaryString = '';
                for (let i = 0; i < uint8Array.length; i++) {
                    binaryString += String.fromCharCode(uint8Array[i]);
                }
                const base64 = btoa(binaryString);
                // Force JPEG - Spotify CDN always returns JPEG
                props.coverUrl = `data:image/jpeg;base64,${base64}`;
                console.log('[Spotify] Cover converted to base64, length:', base64.length);
            } else {
                console.warn('[Spotify] Cover fetch failed with status:', coverRes.status);
                delete props.coverUrl; // Remove so fallback is used
            }
        } catch (e) {
            console.error('[Spotify] Failed to fetch cover image:', e);
            delete props.coverUrl; // Remove so fallback is used
        }
    }

    if (templateName === 'github' && props.username) {
        try {
            const headers: HeadersInit = { 
                'User-Agent': 'Readme-UI',
                'Accept': 'application/vnd.github.mercy-preview+json' // Required to get topics
            };
            if (props.token) {
                headers['Authorization'] = `Bearer ${props.token}`;
            }

            const ghRes = await fetch(`https://api.github.com/users/${props.username}`, { headers });
            
            if (ghRes.ok) {
                // Fetch User Details
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

                // Fetch Repos for Star Count & Languages
                try {
                    const reposRes = await fetch(`https://api.github.com/users/${props.username}/repos?per_page=100&type=owner&sort=updated`, { headers });
                    if (reposRes.ok) {
                        const repos = await reposRes.json();
                        
                        // Sum stars & forks & size
                        const totalStars = repos.reduce((acc: number, repo: any) => acc + (repo.stargazers_count || 0), 0);
                        const totalForks = repos.reduce((acc: number, repo: any) => acc + (repo.forks_count || 0), 0);
                        const totalSizeKB = repos.reduce((acc: number, repo: any) => acc + (repo.size || 0), 0);

                        // Format size
                        let sizeFormatted = '0 KB';
                        if (totalSizeKB > 1024 * 1024) {
                            sizeFormatted = (totalSizeKB / (1024 * 1024)).toFixed(1) + ' GB';
                        } else if (totalSizeKB > 1024) {
                            sizeFormatted = (totalSizeKB / 1024).toFixed(1) + ' MB';
                        } else {
                            sizeFormatted = totalSizeKB + ' KB';
                        }
                        
                        props.stars = totalStars;
                        props.forks = totalForks;
                        props.size = sizeFormatted;

                        // Calculate Top Languages & Topics
                        const langMap: Record<string, number> = {};
                        const topicMap: Record<string, number> = {};
                        let totalReposWithLang = 0;
                        
                        repos.forEach((repo: any) => {
                            if (repo.language) {
                                langMap[repo.language] = (langMap[repo.language] || 0) + 1;
                                totalReposWithLang++;
                            }
                            // Collect Topics
                            if (repo.topics && Array.isArray(repo.topics)) {
                                repo.topics.forEach((topic: string) => {
                                    topicMap[topic] = (topicMap[topic] || 0) + 1;
                                });
                            }
                        });

                        // Process Languages
                        const sortedEntries = Object.entries(langMap)
                            .sort(([, a], [, b]) => b - a);

                        const topLangs = sortedEntries
                            .slice(0, 4) 
                            .map(([lang, count]) => ({ name: lang, count: count }));
                        
                        const topCount = topLangs.reduce((acc, l) => acc + l.count, 0);
                        const otherCount = totalReposWithLang - topCount;

                        if (otherCount > 0) {
                            topLangs.push({ name: 'Others', count: otherCount });
                        }
                        
                        // Process Topics
                        const sortedTopics = Object.entries(topicMap)
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 6)
                            .map(([name]) => name);

                        props.languages = JSON.stringify(topLangs);
                        props.topics = JSON.stringify(sortedTopics);

                        // Fetch Extra Stats (PRs, Issues, Orgs)
                        // Search API has strict limits, so we handle potential failures gently
                        try {
                            const [prsRes, issuesRes, orgsRes] = await Promise.all([
                                fetch(`https://api.github.com/search/issues?q=type:pr+author:${props.username}`, { headers }),
                                fetch(`https://api.github.com/search/issues?q=type:issue+author:${props.username}`, { headers }),
                                fetch(`https://api.github.com/users/${props.username}/orgs`, { headers })
                            ]);

                            if (prsRes.ok) {
                                const prsData = await prsRes.json();
                                props.prs = prsData.total_count;
                            }
                            if (issuesRes.ok) {
                                const issuesData = await issuesRes.json();
                                props.issues = issuesData.total_count;
                            }
                            if (orgsRes.ok) {
                                const orgsData = await orgsRes.json();
                                props.orgs = orgsData.length;
                            }

                            // GraphQL for Total Contributions (Commits++)
                            // Only works if token is present
                            if (props.token) {
                                const query = `
                                  query($login: String!) {
                                    user(login: $login) {
                                      contributionsCollection {
                                        contributionCalendar {
                                          totalContributions
                                        }
                                      }
                                    }
                                  }
                                `;
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
                                    const contributions = gqlData.data?.user?.contributionsCollection?.contributionCalendar?.totalContributions || 0;
                                    props.contributions = contributions;
                                }
                            }

                        } catch (extraErr) {
                            console.warn('Failed to fetch extra stats (PRs/Issues/Graphql)');
                        }
                    }
                } catch (e) {
                    console.warn('Failed to fetch stars/langs', e);
                }
            }
        } catch (err) {
            console.warn('Failed to fetch GitHub data', err);
        }
    }
    // -----------------------------

    // Load Font (Instrument Sans) - with fallback
    let fontData: ArrayBuffer | null = null;
    try {
        const fontUrl = 'https://cdn.jsdelivr.net/npm/@fontsource/instrument-sans@5.1.0/files/instrument-sans-latin-400-normal.woff';
        const fontRes = await fetch(fontUrl);
        if (fontRes.ok) {
            fontData = await fontRes.arrayBuffer();
        } else {
             console.warn('Font fetch failed:', fontRes.statusText);
        }
    } catch (fontErr) {
        console.warn('Font loading error:', fontErr);
    }

    const width = Number(searchParams.get('width')) || 800;
    const height = Number(searchParams.get('height')) || 400;

    try {
        const options: any = {
            width,
            height,
        };

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

