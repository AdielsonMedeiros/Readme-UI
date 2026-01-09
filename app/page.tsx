'use client';

import { Code2, Copy, Layers, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const [params, setParams] = useState({
    template: 'spotify',
    title: 'Never Gonna Give You Up',
    artist: 'Rick Astley',
    progress: 33,
    status: 'Listening on Spotify',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b2735755e164993d98a38ae57aa1',
    width: 600,
    height: 300
  });

  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const query = new URLSearchParams(params as any).toString();
    setUrl(`${baseUrl}/api/render?${query}`);
  }, [params]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: value }));
  };

  const copyToClipboard = () => {
    const markdown = `![Readme-UI](${url})`;
    navigator.clipboard.writeText(markdown);
    alert('Copied Markdown to clipboard!');
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-green-500 selection:text-black">
      {/* Header */}
      <div className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
                    Readme-UI <span className="text-xs text-neutral-500 border border-neutral-700 px-2 py-0.5 rounded-full ml-2">Beta</span>
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
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Template</label>
                        <select 
                            name="template" 
                            value={params.template}
                            onChange={handleChange}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                        >
                            <option value="spotify">Spotify Glassmorphism</option>
                            <option value="github">GitHub Stats (Coming Soon)</option>
                        </select>
                    </div>

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

                     <div className="grid grid-cols-2 gap-4">
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
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-neutral-800 rounded-lg">
                        <Code2 className="w-5 h-5 text-neutral-400" />
                    </div>
                    <code className="text-sm text-neutral-300 font-mono truncate">
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
