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
      // Simple number parsing
      if (!isNaN(Number(value)) && value.trim() !== '') {
        props[key] = Number(value);
      } else {
        props[key] = value;
      }
    });

    // --- Dynamic Data Fetching ---
    if (templateName === 'github' && props.username) {
        try {
            const headers: HeadersInit = { 'User-Agent': 'Readme-UI' };
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
                        
                        // Sum stars & forks
                        const totalStars = repos.reduce((acc: number, repo: any) => acc + (repo.stargazers_count || 0), 0);
                        const totalForks = repos.reduce((acc: number, repo: any) => acc + (repo.forks_count || 0), 0);
                        
                        props.stars = totalStars;
                        props.forks = totalForks;

                        // Calculate Top Languages
                        const langMap: Record<string, number> = {};
                        repos.forEach((repo: any) => {
                            if (repo.language) {
                                langMap[repo.language] = (langMap[repo.language] || 0) + 1;
                            }
                        });

                        const sortedLangs = Object.entries(langMap)
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 4) // Top 4 languages
                            .map(([lang, count]) => ({ name: lang, count: count }));
                            
                        props.languages = JSON.stringify(sortedLangs); // Pass as string to avoid object complexity in generic props
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

