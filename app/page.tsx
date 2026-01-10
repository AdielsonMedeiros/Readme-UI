'use client';

import { AlertCircle, CheckCircle, ChevronDown, Code2, Copy, HelpCircle, Layers, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FaGithub, FaSpotify } from 'react-icons/fa'; // Import brand icons
import { InfoTooltip } from '../components/InfoTooltip';
import { useTranslation } from '../contexts/LanguageContext';

export default function Home() {
  const { t, language, setLanguage } = useTranslation();
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
  const [toast, setToast] = useState<{show: boolean, message: string, type: 'success' | 'error'}>({ show: false, message: '', type: 'success' });

  const showToastFunc = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

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

    // Always include width and height if they exist, plus the template-specific keys
    const baseKeys = ['width', 'height'];
    const specificKeys = relevantKeys[currentTemplate] || Object.keys(params);
    const keysToKeep = Array.from(new Set([...baseKeys, ...specificKeys]));
    
    const filteredParams: any = {};
    keysToKeep.forEach(key => {
        if (params[key] !== undefined && params[key] !== '') {
            filteredParams[key] = params[key];
        }
    });

    // Add random seed to force refresh
    filteredParams['_t'] = Date.now();
    filteredParams['format'] = 'svg';

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
            showToastFunc(t('common.copied'), 'success');
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
            showToastFunc(t('common.copied'), 'success');
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
                     <span className="hidden sm:inline-block text-xs text-neutral-500 border border-neutral-700 px-2 py-0.5 rounded-full ml-4 font-sans align-middle">Beta</span>
                </h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-neutral-400">
                <div className="flex items-center border border-neutral-700 rounded overflow-hidden h-6">
                    <button 
                        onClick={() => setLanguage('en')} 
                        className={`px-2 h-full flex items-center transition-colors text-xs font-medium ${language === 'en' ? 'bg-neutral-700 text-white' : 'hover:bg-neutral-800 hover:text-white'}`}
                    >
                        EN
                    </button>
                    <button 
                        onClick={() => setLanguage('pt')} 
                        className={`px-2 h-full flex items-center transition-colors text-xs font-medium ${language === 'pt' ? 'bg-neutral-700 text-white' : 'hover:bg-neutral-800 hover:text-white'}`}
                    >
                        PT
                    </button>
                </div>
                <button onClick={() => setShowHelp(true)} className="hover:text-white transition-colors flex items-center" title={t('help.title')}>
                    <span className="hidden sm:inline">{t('help.title')}</span>
                    <HelpCircle className="w-5 h-5 sm:hidden" />
                </button>
                <a href="https://github.com/AdielsonMedeiros/Readme-UI" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center" title="GitHub">
                    <span className="hidden sm:inline">GitHub</span>
                    <FaGithub className="w-5 h-5 sm:hidden" />
                </a>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
        {/* Editor Sidebar */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-green-400" />
                    {t('sidebar.configuration')}
                </h2>
                
                <div className="space-y-4">
                    <div className="space-y-4">
                        <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider block">{t('common.chooseTemplate')}</label>
                        
                        {/* Selected Template Header */}
                        {params.template && (
                             <div className="flex items-center justify-between p-4 bg-neutral-800 rounded-xl border border-neutral-700 animate-in fade-in slide-in-from-top-4 duration-300">
                                 <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center">
                                         <Layers className="w-4 h-4 text-white" />
                                     </div>
                                     <div>
                                         <p className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">{t('common.selectedTemplate')}</p>
                                         <p className="text-white font-bold capitalize">{params.template}</p>
                                     </div>
                                 </div>
                                 <button 
                                     onClick={() => setParams({ ...params, template: '' })}
                                     className="text-xs font-medium text-neutral-400 hover:text-white underline decoration-neutral-600 underline-offset-4 transition-colors"
                                 >
                                     {t('common.changeTemplate')}
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
                        <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('sidebar.theme')}</label>
                        <div className="relative">
                            <select 
                                name="theme" 
                                value={params.theme || 'dark'}
                                onChange={handleChange}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-green-500 outline-none transition-all appearance-none text-white cursor-pointer"
                            >
                                <option value="dark">{t('sidebar.darkMode')}</option>
                                <option value="light">{t('sidebar.lightMode')}</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Spotify Specific Controls */}
                    {params.template === 'spotify' && (
                        <>
                             <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.spotify.status')}</label>
                                <input 
                                    type="text" 
                                    name="status"
                                    value={params.status}
                                    onChange={handleChange}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.spotify.songTitle')}</label>
                                <input 
                                    type="text" 
                                    name="title"
                                    value={params.title}
                                    onChange={handleChange}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.spotify.artist')}</label>
                                <input 
                                    type="text" 
                                    name="artist"
                                    value={params.artist}
                                    onChange={handleChange}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex justify-between items-end">
                                    <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.spotify.progress')}</label>
                                    <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded">{params.progress}%</span>
                                </div>
                                <div className="relative w-full h-6 flex items-center">
                                    <input 
                                        type="range" 
                                        name="progress"
                                        min="0"
                                        max="100"
                                        value={params.progress}
                                        onChange={(e) => setParams({...params, progress: Number(e.target.value)})}
                                        className="absolute w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500/50 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-green-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-neutral-900 hover:[&::-webkit-slider-thumb]:scale-110 [&::-webkit-slider-thumb]:transition-transform"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.spotify.duration')}</label>
                                <input 
                                    type="number" 
                                    name="duration"
                                    value={params.duration || 210}
                                    onChange={handleChange}
                                    placeholder="210"
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                />
                                <p className="text-xs text-neutral-500">{t('templates.spotify.durationDesc')}</p>
                            </div>
                        </>
                    )}

                    {/* Tech Stack Controls */}
                    {params.template === 'stack' && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.techStack.title')}</label>
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
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.techStack.skills')}</label>
                                <textarea 
                                    name="skills"
                                    value={params.skills || 'react,typescript,nextdotjs,tailwindcss,nodedotjs,docker'}
                                    onChange={handleChange}
                                    className="w-full h-24 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                    placeholder="react, typescript, ..."
                                />
                                <p className="text-xs text-neutral-500">{t('templates.techStack.skillsDesc')}</p>
                            </div>
                        </div>
                    )}

                    {/* Wave Banner Controls */}
                    {params.template === 'wave' && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.wave.text')}</label>
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
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.wave.subtitle')}</label>
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
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.social.github')}</label>
                                <input type="text" name="github" value={params.github || ''} onChange={handleChange} placeholder="username" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.social.linkedin')}</label>
                                <input type="text" name="linkedin" value={params.linkedin || ''} onChange={handleChange} placeholder="linkedin-username" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.social.twitter')}</label>
                                <input type="text" name="twitter" value={params.twitter || ''} onChange={handleChange} placeholder="@username" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.social.email')}</label>
                                <input type="email" name="email" value={params.email || ''} onChange={handleChange} placeholder="email@example.com" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.social.website')}</label>
                                <input type="url" name="website" value={params.website || ''} onChange={handleChange} placeholder="https://mysite.com" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 outline-none transition-all" />
                            </div>
                        </div>
                    )}

                    {/* Quote Card Controls */}
                    {params.template === 'quote' && (
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.quote.text')}</label>
                                <textarea name="quote" value={params.quote || ''} onChange={handleChange} placeholder={t('templates.quote.placeholder')} className="w-full h-20 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition-all resize-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.quote.author')}</label>
                                <input type="text" name="author" value={params.author || ''} onChange={handleChange} placeholder="Author name" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition-all" />
                            </div>
                        </div>
                    )}

                    {/* Project Showcase Controls */}
                    {params.template === 'project' && (
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.project.repo')}</label>
                                <input type="text" name="repo" value={params.repo || ''} onChange={handleChange} placeholder="username/repo-name" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 outline-none transition-all" />
                                <p className="text-xs text-neutral-500">{t('templates.project.repoDesc')}</p>
                            </div>
                            
                            {/* Only show manual fields if repo is empty */}
                            {!params.repo && (
                                <>
                                    <div className="border-t border-neutral-800 pt-3">
                                        <p className="text-xs text-neutral-500 mb-3">{t('templates.project.manual')}</p>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.project.name')}</label>
                                            <input type="text" name="name" value={params.name || ''} onChange={handleChange} placeholder="my-awesome-project" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 outline-none transition-all" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.project.description')}</label>
                                        <textarea name="description" value={params.description || ''} onChange={handleChange} placeholder="A fantastic project..." className="w-full h-16 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 outline-none transition-all resize-none" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.project.stars')}</label>
                                            <input type="number" name="stars" value={params.stars || ''} onChange={handleChange} placeholder="0" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 outline-none transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.project.forks')}</label>
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
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.typing.lines')}</label>
                                <textarea name="lines" value={params.lines || 'Full Stack Developer|Open Source Enthusiast'} onChange={handleChange} placeholder="Line 1|Line 2|Line 3" className="w-full h-20 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none" />
                                <p className="text-xs text-neutral-500">{t('templates.typing.linesDesc')}</p>
                            </div>
                        </div>
                    )}

                    {/* Dev Joke Controls */}
                    {params.template === 'joke' && (
                        <div className="space-y-3">
                            <p className="text-xs text-neutral-500">{t('templates.joke.desc')}</p>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.joke.custom')}</label>
                                <input type="text" name="joke" value={params.joke || ''} onChange={handleChange} placeholder="Why do programmers..." className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.joke.punchline')}</label>
                                <input type="text" name="punchline" value={params.punchline || ''} onChange={handleChange} placeholder="Because..." className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
                            </div>
                        </div>
                    )}

                    {/* Visitor Counter Controls */}
                    {params.template === 'visitors' && (
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.visitors.username')}</label>
                                <input type="text" name="username" value={params.username || ''} onChange={handleChange} placeholder="AdielsonMedeiros" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-lime-500 outline-none transition-all" />
                                <p className="text-xs text-neutral-500">{t('templates.visitors.usernameDesc')}</p>
                            </div>
                            
                            {/* Only show manual field if username is empty */}
                            {!params.username && (
                                <div className="border-t border-neutral-800 pt-3">
                                    <p className="text-xs text-neutral-500 mb-3">{t('templates.visitors.manual')}</p>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.visitors.count')}</label>
                                        <input type="number" name="count" value={params.count || ''} onChange={handleChange} placeholder="1234" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-lime-500 outline-none transition-all" />
                                    </div>
                                </div>
                            )}
                            
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.visitors.label')}</label>
                                <input type="text" name="label" value={params.label || 'Profile Engagement'} onChange={handleChange} placeholder="Profile Views" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-lime-500 outline-none transition-all" />
                            </div>
                        </div>
                    )}

                    {/* Hacking Simulator Controls */}
                    {params.template === 'hacking' && (
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.hacking.username')}</label>
                                <input type="text" name="username" value={params.username || ''} onChange={handleChange} placeholder="AdielsonMedeiros" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
                                <p className="text-xs text-neutral-500">{t('templates.hacking.desc')}</p>
                            </div>
                        </div>
                    )}

                    {/* Weather Widget Controls */}
                    {params.template === 'weather' && (
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider flex items-center">
                                    {t('templates.weather.location')}
                                    <InfoTooltip text={t('templates.weather.locationHelp')} />
                                </label>
                                <input type="text" name="city" value={params.city || ''} onChange={handleChange} placeholder="San Francisco" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition-all" />
                                <p className="text-xs text-neutral-500">{t('templates.weather.locationDesc')}</p>
                            </div>
                        </div>
                    )}

                    {/* Music Visualizer Controls */}
                    {params.template === 'music' && (
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.music.track')}</label>
                                <input type="text" name="trackName" value={params.trackName || ''} onChange={handleChange} placeholder="Midnight City" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.music.artist')}</label>
                                <input type="text" name="artist" value={params.artist || ''} onChange={handleChange} placeholder="M83" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.music.color')}</label>
                                <input type="color" name="barColor" value={params.barColor || '#1db954'} onChange={handleChange} className="w-full h-8 rounded cursor-pointer" />
                            </div>
                        </div>
                    )}

                    {/* Activity Graph Controls */}
                    {params.template === 'activity' && (
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.activity.username')}</label>
                                <input type="text" name="username" value={params.username || ''} onChange={handleChange} placeholder="AdielsonMedeiros" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-600 outline-none transition-all" />
                                <p className="text-xs text-neutral-500">{t('templates.activity.desc')}</p>
                            </div>
                        </div>
                    )}

                    {/* Snake Game Controls */}
                    {params.template === 'snake' && (
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.snake.username')}</label>
                                <input type="text" name="username" value={params.username || ''} onChange={handleChange} placeholder="AdielsonMedeiros" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-lime-400 outline-none transition-all" />
                                <p className="text-xs text-neutral-500">
                                    {t('templates.snake.desc')}
                                </p>
                            </div>
                        </div>
                    )}




                    {/* LeetCode Stats Controls */}
                    {params.template === 'leetcode' && (
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.leetcode.username')}</label>
                                <input type="text" name="username" value={params.username || ''} onChange={handleChange} placeholder="adielson" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 outline-none transition-all" />
                                <p className="text-xs text-neutral-500">{t('templates.leetcode.desc')}</p>
                            </div>
                        </div>
                    )}

                    {/* WakaTime Stats Controls */}
                    {params.template === 'wakatime' && (
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider flex items-center">
                                    {t('templates.wakatime.url')}
                                    <InfoTooltip text={t('templates.wakatime.urlHelp')} />
                                </label>
                                <input type="text" name="api_url" value={params.api_url || ''} onChange={handleChange} placeholder="https://wakatime.com/share/@user/..." className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                                <p className="text-xs text-neutral-500">{t('templates.wakatime.urlDesc')}</p>
                            </div>
                        </div>
                    )}



                    {/* Goodreads Controls */}
                    {params.template === 'goodreads' && (
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.goodreads.userId')}</label>
                                <input type="text" name="goodreadsId" value={params.goodreadsId || ''} onChange={handleChange} placeholder="e.g., 12345678" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-700 outline-none transition-all" />
                                <p className="text-xs text-neutral-500">{t('templates.goodreads.userIdDesc')}</p>
                            </div>

                            {!params.goodreadsId && (
                                <>
                                    <div className="border-t border-neutral-800 my-2"></div>
                                    <p className="text-xs text-neutral-500 mb-2">{t('templates.goodreads.manualConfig')}</p>
                                    
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.goodreads.bookTitle')}</label>
                                        <input type="text" name="title" value={params.title || ''} onChange={handleChange} placeholder="Title" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-700 outline-none transition-all" />
                                    </div>
                                </>
                            )}
                             
                            {!params.goodreadsId && (
                                <>
                                    <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.goodreads.author')}</label>
                                <input type="text" name="author" value={params.author || ''} onChange={handleChange} placeholder="Author" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-700 outline-none transition-all" />
                            </div>
                            <div className="space-y-3 pt-2">
                                <div className="flex justify-between items-end">
                                    <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('templates.goodreads.progress')}</label>
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
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider flex items-center">
                                    {t('templates.project.token')}
                                    <InfoTooltip text={t('templates.project.tokenHelp')} />
                                </label>
                                <input 
                                    type="password" 
                                    name="token"
                                    placeholder="ghp_..."
                                    value={params.token || ''}
                                    onChange={handleChange}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                />
                                <p className="text-xs text-neutral-500">{t('templates.project.tokenDesc')}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('sidebar.accent')}</label>
                                <div className="relative">
                                    <select 
                                        name="accent" 
                                        value={params.accent || 'blue'}
                                        onChange={handleChange}
                                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-green-500 outline-none transition-all appearance-none text-white cursor-pointer"
                                    >
                                        <option value="blue">{t('colors.blue')} ({t('common.default')})</option>
                                        <option value="purple">{t('colors.purple')}</option>
                                        <option value="green">{t('colors.green')}</option>
                                        <option value="orange">{t('colors.orange')}</option>
                                        <option value="pink">{t('colors.pink')}</option>
                                        <option value="red">{t('colors.red')}</option>
                                        <option value="cyan">{t('colors.cyan')}</option>
                                        <option value="yellow">{t('colors.yellow')}</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                                </div>
                            </div>
                        </>
                    )}

                     <div className="grid grid-cols-2 gap-4 border-t border-neutral-800 pt-4 mt-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider flex items-center">
                                {t('sidebar.width')}
                                <InfoTooltip text={t('sidebar.widthHelp')} />
                            </label>
                            <input 
                                type="number" 
                                name="width"
                                value={params.width}
                                onChange={handleChange}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider flex items-center">
                                {t('sidebar.height')}
                                <InfoTooltip text={t('sidebar.heightHelp')} />
                            </label>
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
                             {t('common.generate')}
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
                        <span className="text-neutral-400 text-sm">{t('common.loading')}</span>
                    </div>
                )}
                
                {/* Empty State */}
                {!url && !loading && (
                    <div className="flex flex-col items-center gap-4 text-center z-10 p-6">
                        <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-2">
                            <Layers className="w-8 h-8 text-neutral-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white">{t('common.ready')}</h3>
                        <p className="text-neutral-400 max-w-md">
                            {t('common.readyDesc')}
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

             <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0 bg-black/30 p-3 rounded-lg border border-neutral-800 w-full sm:w-auto">
                    <Code2 className="w-4 h-4 text-neutral-500 shrink-0" />
                    <code className="text-xs text-neutral-400 font-mono break-all whitespace-pre-wrap select-all">
                        ![ReadMe-UI]({url})
                    </code>
                </div>
                <button 
                    onClick={copyToClipboard}
                    className="group flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-green-900/20 hover:shadow-green-500/30 active:scale-95 whitespace-nowrap shrink-0 w-full sm:w-auto justify-center"
                >
                    <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>{t('common.copy')}</span>
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
                    {t('help.configure')}
                </h2>
                
                <div className="space-y-6 text-neutral-300 max-h-[60vh] overflow-y-auto pr-2">
                    {/* Basic Steps */}
                    <div className="space-y-2">
                        <h3 className="font-bold text-white text-lg border-b border-neutral-800 pb-2">{t('help.quickStart.title')}</h3>
                        <p className="text-sm text-neutral-400">{t('help.quickStart.text')}</p>
                    </div>

                    {/* Goodreads Guide */}
                    <div className="space-y-2">
                        <h3 className="font-bold text-white text-lg border-b border-neutral-800 pb-2 flex items-center gap-2">{t('help.goodreads.title')}</h3>
                        <p className="text-sm text-neutral-400">{t('help.goodreads.text')}</p>
                        <ol className="list-decimal list-inside text-sm text-neutral-400 space-y-1 ml-1">
                            <li>{t('help.goodreads.step1')}</li>
                            <li>{t('help.goodreads.step2')}</li>
                            <li>{t('help.goodreads.step3')}</li>
                        </ol>
                    </div>

                    {/* WakaTime Guide */}
                    <div className="space-y-2">
                        <h3 className="font-bold text-white text-lg border-b border-neutral-800 pb-2 flex items-center gap-2">{t('help.wakatime.title')}</h3>
                        <ol className="list-decimal list-inside text-sm text-neutral-400 space-y-1 ml-1">
                            <li>{t('help.wakatime.step1')}</li>
                            <li>{t('help.wakatime.step2')}</li>
                            <li>{t('help.wakatime.step3')}</li>
                            <li>{t('help.wakatime.step4')}</li>
                        </ol>
                    </div>

                    {/* Spotify Guide */}

                </div>

                <div className="mt-8 pt-6 border-t border-neutral-800 flex justify-end">
                    <button 
                        onClick={() => setShowHelp(false)}
                        className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-neutral-200 transition-colors"
                    >
                        {t('help.close')}
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 bg-neutral-800 border border-neutral-700 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 z-[200]">
            {toast.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
            <span className="font-medium text-sm">{toast.message}</span>
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
