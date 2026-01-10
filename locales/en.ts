export const en = {
  colors: {
    blue: "Blue",
    purple: "Purple",
    green: "Green",
    orange: "Orange",
    pink: "Pink",
    red: "Red",
    cyan: "Cyan",
    yellow: "Yellow"
  },
  common: {
    loading: "Generating...",
    generate: "Generate Widgets",
    generatePreview: "Generate Preview",
    copy: "Copy Markdown",
    copied: "Copied!",
    ready: "Ready to Create?",
    readyDesc: "Select a template from the sidebar, customize your settings, and click Generate Preview to see the magic happen!",
    changeTemplate: "Change",
    selectedTemplate: "Selected Template",
    chooseTemplate: "Choose Template",
    howToUse: "How to use",
    default: "Default"
  },
  sidebar: {
    accent: "Accent Color",
    configuration: "Configuration",
    theme: "Theme",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    width: "Width",
    widthHelp: "Width of the generated image in pixels. Default is 460px.",
    height: "Height",
    heightHelp: "Height of the generated image in pixels. Default is 135px.",
    style: "Style"
  },
  templates: {
    spotify: {
      status: "Status Text",
      statusHelp: "Text displayed below the song title (e.g., 'Listening on Spotify').",
      songTitle: "Song Title",
      artist: "Artist",
      progress: "Progress",
      duration: "Duration (seconds)",
      durationHelp: "Total duration of the song in seconds to calculate the progress bar.",
      durationDesc: "Total song length (e.g., 210 = 3:30)"
    },
    goodreads: {
      userId: "Goodreads User ID (Automagical ✨)",
      userIdDesc: "Found in your profile URL (goodreads.com/user/show/12345-name). If set, updates automatically!",
      manualConfig: "Or configure manually:",
      bookTitle: "Book Title",
      author: "Author",
      progress: "Progress"
    },
    techStack: {
      title: "Stack Title (Optional)",
      skills: "Skills (Comma Separated)",
      skillsDesc: "Use slugs from simpleicons.org (e.g., nextdotjs, nodedotjs)"
    },
    weather: {
      location: "Location",
      locationHelp: "City name (e.g., London) or Zip Code to fetch weather data.",
      locationDesc: "City name (e.g., London) or Zip Code"
    },
    wakatime: {
      url: "Public JSON URL (Optional)",
      urlHelp: "Your WakaTime public JSON URL. Go to Settings > Profile to copy it.",
      urlDesc: "Enable \"Share coding activity\" in WakaTime to get this."
    },
    devJoke: {
        label: "Dev Joke"
    },

    social: {
        github: "GitHub Username",
        linkedin: "LinkedIn",
        twitter: "Twitter/X",
        email: "Email",
        website: "Website"
    },
    quote: {
        text: "Quote Text",
        placeholder: "Leave empty for random quote",
        author: "Author"
    },
    project: {
        repo: "GitHub Repo (Auto-fetch)",
        repoDesc: "Enter username/repo to fetch data automatically (e.g., AdielsonMedeiros/Readme-UI)",
        manual: "Or customize manually:",
        name: "Project Name",
        description: "Description",
        stars: "Stars",
        forks: "Forks",
        token: "GitHub Token (Optional)",
        tokenHelp: "A Personal Access Token (classic) with 'repo' read permissions. Increases API limits.",
        tokenDesc: "Provide a token to increase API rate limits (5000 req/hr)."
    },
    typing: {
        lines: "Text Lines (Separate with |)",
        linesDesc: "Use | to separate multiple lines"
    },
    joke: {
        desc: "🎲 Leave empty for a random programming joke!",
        custom: "Custom Joke",
        punchline: "Punchline"
    },
    visitors: {
        username: "GitHub Username (Auto-fetch)",
        usernameDesc: "Shows followers + repos as engagement metric",
        manual: "Or set manually:",
        count: "Count",
        label: "Label"
    },
    hacking: {
        username: "Target Username",
        desc: "Will fetch recent repos to \"hack\""
    },
    music: {
        track: "Track Name",
        artist: "Artist",
        color: "Bar Color"
    },
    activity: {
        username: "Username",
        desc: "Generates a 3D skyline of contributions"
    },
    snake: {
        username: "GitHub Username",
        desc: "Why just an animation? The snake will eat your real recent commits!"
    },
    leetcode: {
        username: "LeetCode Username",
        desc: "Fetches live stats from LeetCode API"
    },
    wave: {
        text: "Main Text",
        subtitle: "Subtitle"
    }
  },
  help: {
    title: "How to use",
    configure: "How to Configure",
    quickStart: {
        title: "Quick Start",
        text: "Select a template on the left, customize the fields, and click Copy Markdown. Paste the code into your GitHub Profile README."
    },
    goodreads: {
        title: "Goodreads Auto-Updates",
        text: "To have your book update automatically:",
        step1: "Go to your Goodreads Profile.",
        step2: "Look at the URL: goodreads.com/user/show/123456-name.",
        step3: "Copy the number (123456) and paste it into the Goodreads User ID field."
    },
    wakatime: {
        title: "WakaTime Stats",
        step1: "Log in to WakaTime and go to Settings > Profile.",
        step2: "Check \"Display coding activity publicly\".",
        step3: "Change \"Readable by\" to Everyone for \"Languages\".",
        step4: "Copy the JSON URL provided there and paste it into the widget."
    },
    spotify: {
        title: "Spotify",
        text: "For the Spotify widget to show \"Now Playing\" in real-time, you currently need to set the song manually in this generator.",
        note: "(Full OAuth integration coming soon!)"
    },
    close: "Close"
  }
};

export type Translations = typeof en;
