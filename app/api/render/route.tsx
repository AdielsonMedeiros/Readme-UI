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

    // --- Dynamic Data Fetching ---

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

