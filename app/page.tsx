'use client';

import { Code2, Copy, Layers } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FaGithub, FaSpotify } from 'react-icons/fa'; // Import brand icons

export default function Home() {
  const [params, setParams] = useState<any>({
    template: 'spotify',
    title: 'Never Gonna Give You Up',
    artist: 'Rick Astley',
    progress: 33,
    status: 'Listening on Spotify',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b2735755e164993d98a38ae57aa1',
    width: 600,
    height: 500,
    theme: 'dark',
    username: '',
    token: '',
    accent: 'blue'
  });

  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [titleText, setTitleText] = useState('Readme-UI');

  // Typing effect
  useEffect(() => {
    const fullText = "Readme-UI";
    let currentText = fullText;
    let isDeleting = false;
    let loopTimeout: NodeJS.Timeout;

    const animate = () => {
      // Determine typing speed
      let typeSpeed = 150;
      if (isDeleting) typeSpeed = 100;

      if (!isDeleting && currentText === fullText) {
        // Finished typing (or initial full state). Wait 5s before deleting.
        typeSpeed = 5000;
        isDeleting = true;
      } else if (isDeleting && currentText === '') {
        // Finished deleting. Wait 500ms before typing.
        isDeleting = false;
        typeSpeed = 500;
      } else {
        // Normal typing/deleting step
        currentText = isDeleting 
          ? fullText.substring(0, currentText.length - 1) 
          : fullText.substring(0, currentText.length + 1);
        
        setTitleText(currentText);
      }

      loopTimeout = setTimeout(animate, typeSpeed);
    };

    // Start delay
    loopTimeout = setTimeout(animate, 2000);

    return () => clearTimeout(loopTimeout);
  }, []);
  
  // Debounce params to avoid hitting GitHub API rate limits on every keystroke
  const debouncedParams = useDebounce(params, 1000);

  useEffect(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const query = new URLSearchParams(debouncedParams as any).toString();
    setUrl(`${baseUrl}/api/render?${query}`);
  }, [debouncedParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setParams((prev: any) => ({ ...prev, [name]: value }));
  };

  const copyToClipboard = async () => {
    const markdown = `![Readme-UI](${url})`;
    
    // Modern API
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(markdown);
            alert('Copied Markdown to clipboard!');
            return;
        } catch (err) {
            console.error('Clipboard API failed:', err);
        }
    }

    // Fallback for non-secure contexts (http://192.168.x.x)
    try {
        const textArea = document.createElement("textarea");
        textArea.value = markdown;
        
        // Ensure it's not visible but part of DOM
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
            alert('Copied Markdown to clipboard!');
        } else {
            prompt("Copy this manually:", markdown);
        }
    } catch (err) {
        console.error('Fallback copy failed:', err);
        prompt("Copy this manually:", markdown);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-green-500 selection:text-black">
      {/* Header */}
      <div className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400 font-mono">
                    {titleText}<span className="animate-pulse">_</span>
                     <span className="text-xs text-neutral-500 border border-neutral-700 px-2 py-0.5 rounded-full ml-4 font-sans align-middle">Beta</span>
                </h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-neutral-400">
                <a href="#" className="hover:text-white transition-colors">Documentation</a>
                <a href="#" className="hover:text-white transition-colors">GitHub</a>
                <button className="bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-neutral-200 transition-colors">
                    Deploy your own
                </button>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
        {/* Editor Sidebar */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-green-400" />
                    Configuration
                </h2>
                
                <div className="space-y-4">
                    <div className="space-y-4">
                        <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider block">Choose Template</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setParams({ ...params, template: 'spotify', title: 'Never Gonna Give You Up', artist: 'Rick Astley' })}
                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                                    params.template === 'spotify' 
                                    ? 'bg-neutral-800 border-green-500 ring-1 ring-green-500' 
                                    : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700'
                                }`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${params.template === 'spotify' ? 'bg-green-500/20 text-green-500' : 'bg-neutral-800 text-neutral-400'}`}>
                                    <FaSpotify className="w-5 h-5" />
                                </div>
                                <span className={`text-sm font-medium ${params.template === 'spotify' ? 'text-white' : 'text-neutral-400'}`}>Spotify</span>
                            </button>

                            <button
                                onClick={() => setParams({ ...params, template: 'github', title: '' })}
                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                                    params.template === 'github' 
                                    ? 'bg-neutral-800 border-white ring-1 ring-white' 
                                    : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700'
                                }`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${params.template === 'github' ? 'bg-white text-black' : 'bg-neutral-800 text-neutral-400'}`}>
                                    <FaGithub className="w-5 h-5" />
                                </div>
                                <span className={`text-sm font-medium ${params.template === 'github' ? 'text-white' : 'text-neutral-400'}`}>GitHub</span>
                            </button>

                             <button
                                onClick={() => setParams({ ...params, template: 'stack', title: '' })}
                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                                    params.template === 'stack' 
                                    ? 'bg-neutral-800 border-blue-500 ring-1 ring-blue-500' 
                                    : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700'
                                }`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${params.template === 'stack' ? 'bg-blue-500/20 text-blue-500' : 'bg-neutral-800 text-neutral-400'}`}>
                                    <Layers className="w-5 h-5" />
                                </div>
                                <span className={`text-sm font-medium ${params.template === 'stack' ? 'text-white' : 'text-neutral-400'}`}>Tech Stack</span>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Theme</label>
                        <select 
                            name="theme" 
                            value={params.theme || 'dark'}
                            onChange={handleChange}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                        >
                            <option value="dark">Dark Mode</option>
                            <option value="light">Light Mode</option>
                        </select>
                    </div>

                    {/* Spotify Specific Controls */}
                    {params.template === 'spotify' && (
                        <>
                             <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Status Text</label>
                                <input 
                                    type="text" 
                                    name="status"
                                    value={params.status}
                                    onChange={handleChange}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Song Title</label>
                                <input 
                                    type="text" 
                                    name="title"
                                    value={params.title}
                                    onChange={handleChange}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Artist</label>
                                <input 
                                    type="text" 
                                    name="artist"
                                    value={params.artist}
                                    onChange={handleChange}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Progress (%)</label>
                                <input 
                                    type="range" 
                                    name="progress"
                                    min="0"
                                    max="100"
                                    value={params.progress}
                                    onChange={(e) => setParams({...params, progress: Number(e.target.value)})}
                                    className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-green-500"
                                />
                            </div>
                        </>
                    )}

                    {/* Tech Stack Controls */}
                    {params.template === 'stack' && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Stack Title (Optional)</label>
                                <input 
                                    type="text" 
                                    name="title"
                                    value={params.title || ''}
                                    onChange={handleChange}
                                    placeholder="My Tech Stack"
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Skills (Comma Separated)</label>
                                <textarea 
                                    name="skills"
                                    value={params.skills || 'react,typescript,nextdotjs,tailwindcss,nodedotjs,docker'}
                                    onChange={handleChange}
                                    className="w-full h-24 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                    placeholder="react, typescript, ..."
                                />
                                <p className="text-xs text-neutral-500">Use slugs from simpleicons.org (e.g., nextdotjs, nodedotjs)</p>
                            </div>
                        </div>
                    )}

                    {/* GitHub Specific Controls */}
                    {params.template === 'github' && (
                        <>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">GitHub Username</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        name="username"
                                        placeholder="octocat"
                                        value={params.username || ''}
                                        onChange={handleChange}
                                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                    />
                                </div>
                                <p className="text-xs text-neutral-500">Entering a username will fetch real data from GitHub API.</p>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">GitHub Token (Optional)</label>
                                <input 
                                    type="password" 
                                    name="token"
                                    placeholder="ghp_..."
                                    value={params.token || ''}
                                    onChange={handleChange}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                />
                                <p className="text-xs text-neutral-500">Provide a token to increase API rate limits (5000 req/hr).</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Accent Color</label>
                                <select 
                                    name="accent" 
                                    value={params.accent || 'blue'}
                                    onChange={handleChange}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                >
                                    <option value="blue">Blue (Default)</option>
                                    <option value="purple">Purple</option>
                                    <option value="green">Green</option>
                                    <option value="orange">Orange</option>
                                    <option value="pink">Pink</option>
                                    <option value="red">Red</option>
                                    <option value="cyan">Cyan</option>
                                    <option value="yellow">Yellow</option>
                                </select>
                            </div>
                        </>
                    )}

                     <div className="grid grid-cols-2 gap-4 border-t border-neutral-800 pt-4 mt-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Width</label>
                            <input 
                                type="number" 
                                name="width"
                                value={params.width}
                                onChange={handleChange}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Height</label>
                            <input 
                                type="number" 
                                name="height"
                                value={params.height}
                                onChange={handleChange}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Preview Area */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
             <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none"></div>
                
                {/* Visual Loading State could be here */}
                {url && (
                    <img 
                        src={url} 
                        className="rounded-xl shadow-2xl max-w-full transition-all duration-300 hover:scale-[1.01]" 
                        alt="Generated Widget"
                        key={url} // Force re-render just in case
                    />
                )}
             </div>

             <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full">
                    <div className="p-2 bg-neutral-800 rounded-lg shrink-0">
                        <Code2 className="w-5 h-5 text-neutral-400" />
                    </div>
                    <code className="text-sm text-neutral-300 font-mono break-all whitespace-pre-wrap">
                        ![My Widget]({url})
                    </code>
                </div>
                <button 
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-green-900/20"
                >
                    <Copy className="w-4 h-4" />
                    Copy Markdown
                </button>
             </div>
        </div>
      </div>
    </main>
  );
}

// Hook to debounce values
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
