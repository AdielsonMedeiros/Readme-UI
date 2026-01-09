# Readme-UI 🎨

**Readme-UI** is a modern Open Source platform designed to supercharge GitHub Profiles. It generates beautiful, dynamic, and render-ready widgets that you can embed directly into your `README.md`.

Built with **Next.js 14**, **TailwindCSS**, and **Satori**, it turns React components into high-quality SVGs instantly on the Edge.

![Banner](https://github.com/AdielsonMedeiros/Readme-UI/assets/placeholder-banner.png)

---

## ✨ Features

- **🐍 Snake Game**: A playable snake game that eats your GitHub contributions.
  - Usage: `?template=snake&username=YOUR_USER&speed=110&color=green`
- **🎵 Music Visualizer**: A sleek "Now Playing" card with an animated bar visualizer.
  - Usage: `?template=music&trackName=Song&artist=Artist&barColor=1ED760`
- **🧊 3D Contribution Skyline**: An isometric 3D view of your GitHub contribution graph.
  - Usage: `?template=activity&username=YOUR_USER&theme=dark`
- **🏆 LeetCode Stats**: Show off your coding skills with live LeetCode stats.
  - Usage: `?template=leetcode&username=YOUR_LEETCODE_USER`
- **📊 GitHub Stats**: Classic stats card with a modern design.
- **⚡ Tech Stack**: Showcase your skills with icons.
- **🛠️ Live Playground:** Visual editor to customize and preview your widgets.

---

## 🚀 Usage

### 1. In your `README.md`
Simply copy the URL below and change the parameters to match your data.

**Example (Snake Game):**
```markdown
![Snake Animation](https://readme-ui.vercel.app/api/render?template=snake&username=AdielsonMedeiros)
```

**Example (Spotify):**
```markdown
![Music](https://readme-ui.vercel.app/api/render?template=spotify&title=Coding+Vibes&artist=LoFi+Girl&coverUrl=...)
```

---

## 🛠️ Local Development

Want to run it locally? Follow these steps:

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AdielsonMedeiros/Readme-UI.git
   cd Readme-UI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to see the playground.

---

## 🤝 How to Contribute

We love contributions! Whether it's a new template, a bug fix, or a typo correction, your help is welcome.

### 🌟 Adding a New Template
The project is structured to make adding new widgets easy:

1.  **Create your Component:**
    Add a new `.tsx` file in `templates/MyNewWidget.tsx`.
    *   Use Tailwind CSS for styling.
    *   Ensure it accepts props for dynamic data.

2.  **Register the Template:**
    Open `app/api/render/route.tsx`:
    *   Add your template key to the logic (e.g., `if (templateName === 'my-widget')`).
    *   Fetch any necessary external data (API calls).
    *   Pass the data to your component.

3.  **Test It:**
    Run `npm run dev` and test your new template URL locally:
    `http://localhost:3000/api/render?template=my-widget&param=value`

### 🔄 Pull Request Process

1.  **Fork the Project** (Click the "Fork" button on GitHub).
2.  **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`).
3.  **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`).
4.  **Push to the Branch** (`git push origin feature/AmazingFeature`).
5.  **Open a Pull Request**.

### 🐛 Reporting Bugs
Found a bug? Go to the [Issues](https://github.com/AdielsonMedeiros/Readme-UI/issues) tab and open a new issue. Be as detailed as possible!

---

## 📚 API Reference

**Endpoint:** `GET /api/render`

| Parameter | Default | Description |
| :--- | :--- | :--- |
| `template` | `spotify` | Template ID (`snake`, `github`, `spotify`, `weather`, `project`). |
| `username` | - | GitHub username (for Snake/Stats). |
| `width` | `800` | Image width. |
| `height` | `400` | Image height. |

---

**License:** MIT
Made with ❤️ by the Open Source Community.
