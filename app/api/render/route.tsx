import { templateRegistry } from '@/lib/registry';
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
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

                // Fetch Repos for Star Count
                try {
                    const reposRes = await fetch(`https://api.github.com/users/${props.username}/repos?per_page=100&type=owner&sort=updated`, { headers });
                    if (reposRes.ok) {

                        const repos = await reposRes.json();
                        // Sum stars
                        const totalStars = repos.reduce((acc: number, repo: any) => acc + (repo.stargazers_count || 0), 0);
                        props.stars = totalStars;
                    }
                } catch (e) {
                    console.warn('Failed to fetch stars', e);
                }
            }
        } catch (err) {
            console.warn('Failed to fetch GitHub data', err);
        }
    }
    // -----------------------------

    // Load Font (Instrument Sans)
    const fontUrl = 'https://cdn.jsdelivr.net/npm/@fontsource/instrument-sans@5.1.0/files/instrument-sans-latin-400-normal.woff';
    const fontRes = await fetch(fontUrl);
    
    if (!fontRes.ok) {
        throw new Error(`Failed to fetch font from ${fontUrl}: ${fontRes.statusText}`);
    }

    const fontData = await fontRes.arrayBuffer();

    const width = Number(searchParams.get('width')) || 800;
    const height = Number(searchParams.get('height')) || 400;

    return new ImageResponse(
      (
        <Component {...props} />
      ),
      {
        width,
        height,
        fonts: [
          {
            name: 'Instrument Sans',
            data: fontData,
            style: 'normal',
            weight: 400,
          },
        ],
        headers: {
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (e: any) {
    console.error(e);
    return new Response(`Failed to generate image: ${e.message}`, { status: 500 });
  }
}
