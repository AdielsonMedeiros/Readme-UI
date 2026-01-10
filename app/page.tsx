'use client';

import { Code2, Copy, Layers, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FaGithub, FaSpotify } from 'react-icons/fa'; // Import brand icons



export default function Home() {
  const [showHelp, setShowHelp] = useState(false);
  const [params, setParams] = useState<any>({
    template: '',
    title: 'Never Gonna Give You Up',
    artist: 'Rick Astley',
    progress: 33,
    status: 'Listening on Spotify',
    coverUrl: '',
    width: 460,
    height: 135,
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

  // Manual generation handler
  const handleGenerate = () => {
    setLoading(true);
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    
    // Filter params based on active template to keep URLs clean
    const relevantKeys: Record<string, string[]> = {
        spotify: ['template', 'title', 'artist', 'progress', 'status', 'coverUrl', 'duration', 'theme', 'width', 'height'],
        github: ['template', 'username', 'token', 'accent', 'theme', 'width', 'height'],
        stack: ['template', 'title', 'skills', 'theme'],
        wave: ['template', 'text', 'subtitle', 'gradient', 'theme'],
        social: ['template', 'github', 'linkedin', 'twitter', 'email', 'website', 'theme'],
        quote: ['template', 'quote', 'author', 'theme'],
        project: ['template', 'repo', 'name', 'description', 'stars', 'forks', 'theme'],
        typing: ['template', 'lines', 'theme'],
        joke: ['template', 'joke', 'punchline', 'theme'],
        hacking: ['template', 'username', 'theme'],
        weather: ['template', 'city', 'theme'],
        music: ['template', 'trackName', 'artist', 'barColor', 'theme'],
        activity: ['template', 'username', 'theme'],
        snake: ['template', 'username', 'speed', 'color', 'theme'], // Include speed/color for future proofing
        visitors: ['template', 'username', 'count', 'label', 'theme'],
        leetcode: ['template', 'username', 'theme'],
        wakatime: ['template', 'theme', 'api_url'],
        goodreads: ['template', 'goodreadsId', 'title', 'progress', 'coverUrl', 'theme', 'author']
    };

    const currentTemplate = params.template;
    if (!currentTemplate) return;

    const keysToKeep = relevantKeys[currentTemplate] || Object.keys(params);
    
    const filteredParams: any = {};
    keysToKeep.forEach(key => {
        if (params[key] !== undefined && params[key] !== '') {
            filteredParams[key] = params[key];
        }
    });

    const query = new URLSearchParams(filteredParams).toString();
    setUrl(`${baseUrl}/api/render?${query}`);
  };

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
                <button onClick={() => setShowHelp(true)} className="hover:text-white transition-colors">How to use</button>
                <a href="https://github.com/AdielsonMedeiros/Readme-UI" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>

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
                        
                        {/* Selected Template Header */}
                        {params.template && (
                             <div className="flex items-center justify-between p-4 bg-neutral-800 rounded-xl border border-neutral-700 animate-in fade-in slide-in-from-top-4 duration-300">
                                 <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center">
                                         <Layers className="w-4 h-4 text-white" />
                                     </div>
                                     <div>
                                         <p className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Selected Template</p>
                                         <p className="text-white font-bold capitalize">{params.template}</p>
                                     </div>
                                 </div>
                                 <button 
                                     onClick={() => setParams({ ...params, template: '' })}
                                     className="text-xs font-medium text-neutral-400 hover:text-white underline decoration-neutral-600 underline-offset-4 transition-colors"
                                 >
                                     Change
                                 </button>
                             </div>
                        )}

                        <div className={`grid grid-cols-3 gap-3 transition-all duration-500 ease-in-out overflow-hidden ${params.template ? 'max-h-0 opacity-0 pointer-events-none' : 'max-h-[800px] opacity-100'}`}>
                            <button
                                onClick={() => setParams({ ...params, template: 'github', title: '' })}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                                    params.template === 'github' 
                                    ? 'bg-neutral-800 border-white ring-1 ring-white' 
                                    : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700'
                                }`}
                            >
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${params.template === 'github' ? 'bg-white text-black' : 'bg-neutral-800 text-neutral-400'}`}>
                                    <FaGithub className="w-4 h-4" />
                                </div>
                                <span className={`text-xs font-medium ${params.template === 'github' ? 'text-white' : 'text-neutral-400'}`}>GitHub</span>
                            </button>

                             <button
                                onClick={() => setParams({ ...params, template: 'stack', title: '' })}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                                    params.template === 'stack' 
                                    ? 'bg-neutral-800 border-blue-500 ring-1 ring-blue-500' 
                                    : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700'
                                }`}
                            >
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${params.template === 'stack' ? 'bg-blue-500/20 text-blue-500' : 'bg-neutral-800 text-neutral-400'}`}>
                                    <Layers className="w-4 h-4" />
                                </div>
                                <span className={`text-xs font-medium ${params.template === 'stack' ? 'text-white' : 'text-neutral-400'}`}>Stack</span>
                            </button>

                            <button
                                onClick={() => setParams({ ...params, template: 'wave', text: "Hello, I'm Dev", subtitle: 'Full Stack Developer' })}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                                    params.template === 'wave' 
                                    ? 'bg-neutral-800 border-purple-500 ring-1 ring-purple-500' 
                                    : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700'
                                }`}
                            >
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${params.template === 'wave' ? 'bg-purple-500/20 text-purple-500' : 'bg-neutral-800 text-neutral-400'}`}>
                                    <span className={`text-lg ${params.template === 'wave' ? '' : 'grayscale opacity-50'}`}>🌊</span>
                                </div>
                                <span className={`text-xs font-medium ${params.template === 'wave' ? 'text-white' : 'text-neutral-400'}`}>Wave</span>
                            </button>

                            <button
                                onClick={() => setParams({ ...params, template: 'social', github: 'AdielsonMedeiros' })}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                                    params.template === 'social' 
                                    ? 'bg-neutral-800 border-cyan-500 ring-1 ring-cyan-500' 
                                    : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700'
                                }`}
                            >
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${params.template === 'social' ? 'bg-cyan-500/20 text-cyan-500' : 'bg-neutral-800 text-neutral-400'}`}>
                                    <span className={`text-lg ${params.template === 'social' ? '' : 'grayscale opacity-50'}`}>🔗</span>
                                </div>
                                <span className={`text-xs font-medium ${params.template === 'social' ? 'text-white' : 'text-neutral-400'}`}>Social</span>
                            </button>

                            <button
                                onClick={() => setParams({ ...params, template: 'spotify', title: 'Never Gonna Give You Up', artist: 'Rick Astley', width: 460, height: 135 })}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                                    params.template === 'spotify' 
                                    ? 'bg-neutral-800 border-green-500 ring-1 ring-green-500' 
                                    : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700'
                                }`}
                            >
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${params.template === 'spotify' ? 'bg-green-500/20 text-green-500' : 'bg-neutral-800 text-neutral-400'}`}>
                                    <FaSpotify className="w-4 h-4" />
                                </div>
                                <span className={`text-xs font-medium ${params.template === 'spotify' ? 'text-white' : 'text-neutral-400'}`}>Spotify</span>
                            </button>

                            <button
                                onClick={() => setParams({ ...params, template: 'quote' })}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                                    params.template === 'quote' 
                                    ? 'bg-neutral-800 border-blue-400 ring-1 ring-blue-400' 
                                    : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700'
                                }`}
                            >
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${params.template === 'quote' ? 'bg-blue-400/20 text-blue-400' : 'bg-neutral-800 text-neutral-400'}`}>
                                    <span className={`text-lg ${params.template === 'quote' ? '' : 'grayscale opacity-50'}`}>💬</span>
                                </div>
                                <span className={`text-xs font-medium ${params.template === 'quote' ? 'text-white' : 'text-neutral-400'}`}>Quote</span>
                            </button>

                            <button
                                onClick={() => setParams({ ...params, template: 'project', name: 'my-project' })}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                                    params.template === 'project' 
                                    ? 'bg-neutral-800 border-yellow-500 ring-1 ring-yellow-500' 
                                    : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700'
                                }`}
                            >
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${params.template === 'project' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-neutral-800 text-neutral-400'}`}>
                                    <span className={`text-lg ${params.template === 'project' ? '' : 'grayscale opacity-50'}`}>🏆</span>
                                </div>
                                <span className={`text-xs font-medium ${params.template === 'project' ? 'text-white' : 'text-neutral-400'}`}>Project</span>
                            </button>

                            <button
                                onClick={() => setParams({ ...params, template: 'typing', lines: 'Full Stack Developer|Open Source Enthusiast' })}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                                    params.template === 'typing' 
                                    ? 'bg-neutral-800 border-emerald-500 ring-1 ring-emerald-500' 
                                    : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700'
                                }`}
                            >
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${params.template === 'typing' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-neutral-800 text-neutral-400'}`}>
                                    <span className={`text-lg ${params.template === 'typing' ? '' : 'grayscale opacity-50'}`}>⌨️</span>
                                </div>
                                <span className={`text-xs font-medium ${params.template === 'typing' ? 'text-white' : 'text-neutral-400'}`}>Typing</span>
                            </button>

                            <button
                                onClick={() => setParams({ ...params, template: 'joke' })}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                                    params.template === 'joke' 
                                    ? 'bg-neutral-800 border-orange-500 ring-1 ring-orange-500' 
                                    : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700'
                                }`}
                            >
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${params.template === 'joke' ? 'bg-orange-500/20 text-orange-500' : 'bg-neutral-800 text-neutral-400'}`}>
                                    <span className={`text-lg ${params.template === 'joke' ? '' : 'grayscale opacity-50'}`}>😂</span>
                                </div>
                                <span className={`text-xs font-medium ${params.template === 'joke' ? 'text-white' : 'text-neutral-400'}`}>Joke</span>
                            </button>

                            <button
                                onClick={() => setParams({ ...params, template: 'hacking', username: 'AdielsonMedeiros' })}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                                    params.template === 'hacking' 
                                    ? 'bg-neutral-800 border-green-500 ring-1 ring-green-500' 
                                    : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700'
                                }`}
                            >
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${params.template === 'hacking' ? 'bg-green-500/20 text-green-500' : 'bg-neutral-800 text-neutral-400'}`}>
                                    <span className={`text-lg ${params.template === 'hacking' ? '' : 'grayscale opacity-50'}`}>👨‍💻</span>
                                </div>
                                <span className={`text-xs font-medium ${params.template === 'hacking' ? 'text-white' : 'text-neutral-400'}`}>Hacking</span>
                            </button>

                            <button
                                onClick={() => setParams({ ...params, template: 'weather', city: 'San Francisco' })}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                                    params.template === 'weather' 
                                    ? 'bg-neutral-800 border-blue-400 ring-1 ring-blue-400' 
                                    : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700'
                                }`}
                            >
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${params.template === 'weather' ? 'bg-blue-400/20 text-blue-400' : 'bg-neutral-800 text-neutral-400'}`}>
                                    <span className={`text-lg ${params.template === 'weather' ? '' : 'grayscale opacity-50'}`}>⛅</span>
                                </div>
                                <span className={`text-xs font-medium ${params.template === 'weather' ? 'text-white' : 'text-neutral-400'}`}>Weather</span>
                            </button>

                            <button
                                onClick={() => setParams({ ...params, template: 'music', trackName: 'Midnight City', artist: 'M83' })}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                                    params.template === 'music' 
                                    ? 'bg-neutral-800 border-purple-500 ring-1 ring-purple-500' 
                                    : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700'
                                }`}
                            >
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${params.template === 'music' ? 'bg-purple-500/20 text-purple-500' : 'bg-neutral-800 text-neutral-400'}`}>
                                    <span className={`text-lg ${params.template === 'music' ? '' : 'grayscale opacity-50'}`}>🎵</span>
                                </div>
                                <span className={`text-xs font-medium ${params.template === 'music' ? 'text-white' : 'text-neutral-400'}`}>Music</span>
                            </button>

                            <button
                                onClick={() => setParams({ ...params, template: 'activity', username: 'AdielsonMedeiros' })}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                                    params.template === 'activity' 
                                    ? 'bg-neutral-800 border-emerald-600 ring-1 ring-emerald-600' 
                                    : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700'
                                }`}
                            >
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${params.template === 'activity' ? 'bg-emerald-600/20 text-emerald-600' : 'bg-neutral-800 text-neutral-400'}`}>
                                    <span className={`text-lg ${params.template === 'activity' ? '' : 'grayscale opacity-50'}`}>🧊</span>
                                </div>
                                <span className={`text-xs font-medium ${params.template === 'activity' ? 'text-white' : 'text-neutral-400'}`}>3D Graph</span>
                            </button>

                            <button
                                onClick={() => setParams({ ...params, template: 'snake' })}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                                    params.template === 'snake' 
                                    ? 'bg-neutral-800 border-lime-400 ring-1 ring-lime-400' 
                                    : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700'
                                }`}
                            >
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${params.template === 'snake' ? 'bg-lime-400/20 text-lime-400' : 'bg-neutral-800 text-neutral-400'}`}>
                                    <span className={`text-lg ${params.template === 'snake' ? '' : 'grayscale opacity-50'}`}>🐍</span>
                                </div>
                                <span className={`text-xs font-medium ${params.template === 'snake' ? 'text-white' : 'text-neutral-400'}`}>Snake</span>
                            </button>

                            <button
                                onClick={() => setParams({ ...params, template: 'visitors', count: 1234 })}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                                    params.template === 'visitors' 
                                    ? 'bg-neutral-800 border-lime-500 ring-1 ring-lime-500' 
                                    : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700'
                                }`}
                            >
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${params.template === 'visitors' ? 'bg-lime-500/20 text-lime-500' : 'bg-neutral-800 text-neutral-400'}`}>
                                    <span className={`text-lg ${params.template === 'visitors' ? '' : 'grayscale opacity-50'}`}>👁️</span>
                                </div>
                                <span className={`text-xs font-medium ${params.template === 'visitors' ? 'text-white' : 'text-neutral-400'}`}>Views</span>
                            </button>

                            <button
                                onClick={() => setParams({ ...params, template: 'leetcode', username: 'AdielsonMedeiros' })}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                                    params.template === 'leetcode' 
                                    ? 'bg-neutral-800 border-yellow-500 ring-1 ring-yellow-500' 
                                    : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700'
                                }`}
                            >
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${params.template === 'leetcode' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-neutral-800 text-neutral-400'}`}>
                                <span className={`text-lg ${params.template === 'leetcode' ? '' : 'grayscale opacity-50'}`}>🏅</span>
                                </div>
                                <span className={`text-xs font-medium ${params.template === 'leetcode' ? 'text-white' : 'text-neutral-400'}`}>LeetCode</span>
                            </button>

                            <button
                                onClick={() => setParams({ ...params, template: 'wakatime', api_url: '' })}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                                    params.template === 'wakatime' 
                                    ? 'bg-neutral-800 border-blue-600 ring-1 ring-blue-600' 
                                    : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700'
                                }`}
                            >
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${params.template === 'wakatime' ? 'bg-blue-600/20 text-blue-600' : 'bg-neutral-800 text-neutral-400'}`}>
                                    <span className={`text-lg ${params.template === 'wakatime' ? '' : 'grayscale opacity-50'}`}>⌚</span>
                                </div>
                                <span className={`text-xs font-medium ${params.template === 'wakatime' ? 'text-white' : 'text-neutral-400'}`}>WakaTime</span>
                            </button>



                            <button
                                onClick={() => setParams({ ...params, template: 'goodreads', title: 'The Pragmatic Programmer', progress: 42 })}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                                    params.template === 'goodreads' 
                                    ? 'bg-neutral-800 border-amber-700 ring-1 ring-amber-700' 
                                    : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700'
                                }`}
                            >
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${params.template === 'goodreads' ? 'bg-amber-700/20 text-amber-700' : 'bg-neutral-800 text-neutral-400'}`}>
                                    <span className={`text-lg ${params.template === 'goodreads' ? '' : 'grayscale opacity-50'}`}>📚</span>
                                </div>
                                <span className={`text-xs font-medium ${params.template === 'goodreads' ? 'text-white' : 'text-neutral-400'}`}>Goodreads</span>
                            </button>

                        </div>
                    </div>

                    {params.template && (
                        <>
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

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Duration (seconds)</label>
                                <input 
                                    type="number" 
                                    name="duration"
                                    value={params.duration || 210}
                                    onChange={handleChange}
                                    placeholder="210"
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                />
                                <p className="text-xs text-neutral-500">Total song length (e.g., 210 = 3:30)</p>
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

                    {/* Wave Banner Controls */}
                    {params.template === 'wave' && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Main Text</label>
                                <input 
                                    type="text" 
                                    name="text"
                                    value={params.text || "Hello, I'm Dev"}
                                    onChange={handleChange}
                                    placeholder="Hello, I'm Developer"
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Subtitle</label>
                                <input 
                                    type="text" 
                                    name="subtitle"
                                    value={params.subtitle || 'Full Stack Developer'}
                                    onChange={handleChange}
                                    placeholder="Full Stack Developer"
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Gradient Color</label>
                                <select 
                                    name="gradient" 
                                    value={params.gradient || 'blue'}
                                    onChange={handleChange}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                >
                                    <option value="blue">Blue → Purple</option>
                                    <option value="purple">Purple → Indigo</option>
                                    <option value="green">Green</option>
                                    <option value="orange">Orange → Red</option>
                                    <option value="pink">Pink → Purple</option>
                                    <option value="cyan">Cyan → Blue</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Social Links Controls */}
                    {params.template === 'social' && (
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">GitHub Username</label>
                                <input type="text" name="github" value={params.github || ''} onChange={handleChange} placeholder="username" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">LinkedIn</label>
                                <input type="text" name="linkedin" value={params.linkedin || ''} onChange={handleChange} placeholder="linkedin-username" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Twitter/X</label>
                                <input type="text" name="twitter" value={params.twitter || ''} onChange={handleChange} placeholder="@username" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Email</label>
                                <input type="email" name="email" value={params.email || ''} onChange={handleChange} placeholder="email@example.com" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Website</label>
                                <input type="url" name="website" value={params.website || ''} onChange={handleChange} placeholder="https://mysite.com" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 outline-none transition-all" />
                            </div>
                        </div>
                    )}

                    {/* Quote Card Controls */}
                    {params.template === 'quote' && (
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Quote Text</label>
                                <textarea name="quote" value={params.quote || ''} onChange={handleChange} placeholder="Leave empty for random quote" className="w-full h-20 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition-all resize-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Author</label>
                                <input type="text" name="author" value={params.author || ''} onChange={handleChange} placeholder="Author name" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition-all" />
                            </div>
                        </div>
                    )}

                    {/* Project Showcase Controls */}
                    {params.template === 'project' && (
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">GitHub Repo (Auto-fetch)</label>
                                <input type="text" name="repo" value={params.repo || ''} onChange={handleChange} placeholder="username/repo-name" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 outline-none transition-all" />
                                <p className="text-xs text-neutral-500">Enter username/repo to fetch data automatically (e.g., AdielsonMedeiros/Readme-UI)</p>
                            </div>
                            
                            {/* Only show manual fields if repo is empty */}
                            {!params.repo && (
                                <>
                                    <div className="border-t border-neutral-800 pt-3">
                                        <p className="text-xs text-neutral-500 mb-3">Or customize manually:</p>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Project Name</label>
                                            <input type="text" name="name" value={params.name || ''} onChange={handleChange} placeholder="my-awesome-project" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 outline-none transition-all" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Description</label>
                                        <textarea name="description" value={params.description || ''} onChange={handleChange} placeholder="A fantastic project..." className="w-full h-16 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 outline-none transition-all resize-none" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Stars</label>
                                            <input type="number" name="stars" value={params.stars || ''} onChange={handleChange} placeholder="0" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 outline-none transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Forks</label>
                                            <input type="number" name="forks" value={params.forks || ''} onChange={handleChange} placeholder="0" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 outline-none transition-all" />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Typing Text Controls */}
                    {params.template === 'typing' && (
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Text Lines (Separate with |)</label>
                                <textarea name="lines" value={params.lines || 'Full Stack Developer|Open Source Enthusiast'} onChange={handleChange} placeholder="Line 1|Line 2|Line 3" className="w-full h-20 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none" />
                                <p className="text-xs text-neutral-500">Use | to separate multiple lines</p>
                            </div>
                        </div>
                    )}

                    {/* Dev Joke Controls */}
                    {params.template === 'joke' && (
                        <div className="space-y-3">
                            <p className="text-xs text-neutral-500">🎲 Leave empty for a random programming joke!</p>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Custom Joke</label>
                                <input type="text" name="joke" value={params.joke || ''} onChange={handleChange} placeholder="Why do programmers..." className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Punchline</label>
                                <input type="text" name="punchline" value={params.punchline || ''} onChange={handleChange} placeholder="Because..." className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
                            </div>
                        </div>
                    )}

                    {/* Visitor Counter Controls */}
                    {params.template === 'visitors' && (
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">GitHub Username (Auto-fetch)</label>
                                <input type="text" name="username" value={params.username || ''} onChange={handleChange} placeholder="AdielsonMedeiros" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-lime-500 outline-none transition-all" />
                                <p className="text-xs text-neutral-500">Shows followers + repos as engagement metric</p>
                            </div>
                            
                            {/* Only show manual field if username is empty */}
                            {!params.username && (
                                <div className="border-t border-neutral-800 pt-3">
                                    <p className="text-xs text-neutral-500 mb-3">Or set manually:</p>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Count</label>
                                        <input type="number" name="count" value={params.count || ''} onChange={handleChange} placeholder="1234" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-lime-500 outline-none transition-all" />
                                    </div>
                                </div>
                            )}
                            
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Label</label>
                                <input type="text" name="label" value={params.label || 'Profile Engagement'} onChange={handleChange} placeholder="Profile Views" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-lime-500 outline-none transition-all" />
                            </div>
                        </div>
                    )}

                    {/* Hacking Simulator Controls */}
                    {params.template === 'hacking' && (
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Target Username</label>
                                <input type="text" name="username" value={params.username || ''} onChange={handleChange} placeholder="AdielsonMedeiros" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
                                <p className="text-xs text-neutral-500">Will fetch recent repos to "hack"</p>
                            </div>
                        </div>
                    )}

                    {/* Weather Widget Controls */}
                    {params.template === 'weather' && (
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">City</label>
                                <input type="text" name="city" value={params.city || ''} onChange={handleChange} placeholder="San Francisco" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition-all" />
                                <p className="text-xs text-neutral-500">Auto-fetches current weather from Open-Meteo</p>
                            </div>
                        </div>
                    )}

                    {/* Music Visualizer Controls */}
                    {params.template === 'music' && (
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Track Name</label>
                                <input type="text" name="trackName" value={params.trackName || ''} onChange={handleChange} placeholder="Midnight City" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Artist</label>
                                <input type="text" name="artist" value={params.artist || ''} onChange={handleChange} placeholder="M83" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Bar Color</label>
                                <input type="color" name="barColor" value={params.barColor || '#1db954'} onChange={handleChange} className="w-full h-8 rounded cursor-pointer" />
                            </div>
                        </div>
                    )}

                    {/* Activity Graph Controls */}
                    {params.template === 'activity' && (
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Username</label>
                                <input type="text" name="username" value={params.username || ''} onChange={handleChange} placeholder="AdielsonMedeiros" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-600 outline-none transition-all" />
                                <p className="text-xs text-neutral-500">Generates a 3D skyline of contributions</p>
                            </div>
                        </div>
                    )}

                    {/* Snake Game Controls */}
                    {params.template === 'snake' && (
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">GitHub Username</label>
                                <input type="text" name="username" value={params.username || ''} onChange={handleChange} placeholder="AdielsonMedeiros" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-lime-400 outline-none transition-all" />
                                <p className="text-xs text-neutral-500">
                                    Why just an animation? The snake will eat your real recent commits!
                                </p>
                            </div>
                        </div>
                    )}




                    {/* LeetCode Stats Controls */}
                    {params.template === 'leetcode' && (
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">LeetCode Username</label>
                                <input type="text" name="username" value={params.username || ''} onChange={handleChange} placeholder="adielson" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 outline-none transition-all" />
                                <p className="text-xs text-neutral-500">Fetches live stats from LeetCode API</p>
                            </div>
                        </div>
                    )}

                    {/* WakaTime Stats Controls */}
                    {params.template === 'wakatime' && (
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Public JSON URL (Optional)</label>
                                <input type="text" name="api_url" value={params.api_url || ''} onChange={handleChange} placeholder="https://wakatime.com/share/@user/stats.json" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                                <p className="text-xs text-neutral-500">Enable "Share coding activity" in WakaTime to get this.</p>
                            </div>
                        </div>
                    )}



                    {/* Goodreads Controls */}
                    {params.template === 'goodreads' && (
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Goodreads User ID (Automagical ✨)</label>
                                <input type="text" name="goodreadsId" value={params.goodreadsId || ''} onChange={handleChange} placeholder="e.g., 12345678" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-700 outline-none transition-all" />
                                <p className="text-xs text-neutral-500">Found in your profile URL (goodreads.com/user/show/<b>12345</b>-name). If set, updates automatically!</p>
                            </div>

                            {!params.goodreadsId && (
                                <>
                                    <div className="border-t border-neutral-800 my-2"></div>
                                    <p className="text-xs text-neutral-500 mb-2">Or configure manually:</p>
                                    
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Book Title</label>
                                        <input type="text" name="title" value={params.title || ''} onChange={handleChange} placeholder="Title" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-700 outline-none transition-all" />
                                    </div>
                                </>
                            )}
                             
                            {!params.goodreadsId && (
                                <>
                                    <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Author</label>
                                <input type="text" name="author" value={params.author || ''} onChange={handleChange} placeholder="Author" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-700 outline-none transition-all" />
                            </div>
                            <div className="space-y-3 pt-2">
                                <div className="flex justify-between items-end">
                                    <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Progress</label>
                                    <div className="flex items-center gap-1 bg-neutral-800 px-2 py-1 rounded border border-neutral-700">
                                        <span className="text-sm font-bold text-amber-500">{params.progress || 0}</span>
                                        <span className="text-xs text-neutral-500">%</span>
                                    </div>
                                </div>
                                <div className="relative w-full h-6 flex items-center">
                                    <input 
                                        type="range" 
                                        name="progress"
                                        min="0"
                                        max="100"
                                        value={params.progress || 0}
                                        onChange={(e) => setParams({...params, progress: Number(e.target.value)})}
                                        style={{
                                            background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${params.progress || 0}%, #404040 ${params.progress || 0}%, #404040 100%)`
                                        }}
                                        className="w-full h-2 rounded-lg appearance-none cursor-pointer 
                                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-amber-500 hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                                    />
                                </div>
                            </div>
                             <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Cover URL (Optional)</label>
                                <input type="text" name="coverUrl" value={params.coverUrl || ''} onChange={handleChange} placeholder="https://..." className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-700 outline-none transition-all" />
                                <p className="text-xs text-neutral-500">Right-click a book cover image online &gt; "Copy image address" and paste here.</p>
                            </div>
                            </>
                            )}
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
                        </>
                    )}
                    
                    <button 
                         onClick={handleGenerate}
                         disabled={!params.template}
                         className="w-full mt-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-bold text-white shadow-lg hover:shadow-green-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                     >
                         <span className="flex items-center justify-center gap-2">
                             <Layers className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                             Generate Widgets
                         </span>
                     </button>
                    
        </div>
            </div>
        </div>

        {/* Preview Area */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
             <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center justify-center min-h-[250px] relative overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none"></div>
                
                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center gap-4 z-10">
                        <div className="w-12 h-12 border-4 border-neutral-700 border-t-green-500 rounded-full animate-spin"></div>
                        <span className="text-neutral-400 text-sm">Generating preview...</span>
                    </div>
                )}
                
                {/* Empty State */}
                {!url && !loading && (
                    <div className="flex flex-col items-center gap-4 text-center z-10 p-6">
                        <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-2">
                            <Layers className="w-8 h-8 text-neutral-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Ready to Create?</h3>
                        <p className="text-neutral-400 max-w-md">
                            Select a template from the sidebar, customize your settings, and click <b>Generate Widgets</b> to see the magic happen!
                        </p>
                    </div>
                )}

                {/* Image Preview */}
                {url && (
                    <img 
                        src={url} 
                        className={`rounded-xl shadow-2xl max-w-full transition-all duration-300 hover:scale-[1.01] ${loading ? 'opacity-0 absolute' : 'opacity-100'}`}
                        alt="Generated Widget"
                        key={url}
                        onLoad={() => setLoading(false)}
                        onError={() => setLoading(false)}
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
      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl max-w-lg w-full relative shadow-2xl animate-in fade-in zoom-in duration-200">
                <button 
                    onClick={() => setShowHelp(false)} 
                    className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
                
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    How to Configure
                </h2>
                
                <div className="space-y-6 text-neutral-300 max-h-[60vh] overflow-y-auto pr-2">
                    {/* Basic Steps */}
                    <div className="space-y-2">
                        <h3 className="font-bold text-white text-lg border-b border-neutral-800 pb-2">1. Quick Start</h3>
                        <p className="text-sm text-neutral-400">Select a template on the left, customize the fields, and click <b>Copy Markdown</b>. Paste the code into your GitHub Profile README.</p>
                    </div>

                    {/* Goodreads Guide */}
                    <div className="space-y-2">
                        <h3 className="font-bold text-white text-lg border-b border-neutral-800 pb-2 flex items-center gap-2">Goodreads Auto-Updates</h3>
                        <p className="text-sm text-neutral-400">To have your book update automatically:</p>
                        <ol className="list-decimal list-inside text-sm text-neutral-400 space-y-1 ml-1">
                            <li>Go to your <a href="https://www.goodreads.com" target="_blank" className="text-green-400 hover:underline">Goodreads Profile</a>.</li>
                            <li>Look at the URL: <code>goodreads.com/user/show/<b>123456</b>-name</code>.</li>
                            <li>Copy the number (<b>123456</b>) and paste it into the <b>Goodreads User ID</b> field.</li>
                        </ol>
                    </div>

                    {/* WakaTime Guide */}
                    <div className="space-y-2">
                        <h3 className="font-bold text-white text-lg border-b border-neutral-800 pb-2 flex items-center gap-2">WakaTime Stats</h3>
                        <ol className="list-decimal list-inside text-sm text-neutral-400 space-y-1 ml-1">
                            <li>Log in to WakaTime and go to <b>Settings &gt; Profile</b>.</li>
                            <li>Check <b>"Display coding activity publicly"</b>.</li>
                            <li>Change "Readable by" to <b>Everyone</b> for "Languages".</li>
                            <li>Copy the <b>JSON URL</b> provided there and paste it into the widget.</li>
                        </ol>
                    </div>

                    {/* Spotify Guide */}
                    <div className="space-y-2">
                        <h3 className="font-bold text-white text-lg border-b border-neutral-800 pb-2 flex items-center gap-2">Spotify</h3>
                        <p className="text-sm text-neutral-400">
                             For the Spotify widget to show "Now Playing" in real-time, you currently need to set the song manually in this generator. 
                             <br/><span className="italic text-xs opacity-70">(Full OAuth integration coming soon!)</span>
                        </p>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-neutral-800 flex justify-end">
                    <button 
                        onClick={() => setShowHelp(false)}
                        className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-neutral-200 transition-colors"
                    >
                        Got it!
                    </button>
                </div>
            </div>
        </div>
      )}
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
