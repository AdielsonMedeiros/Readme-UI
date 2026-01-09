# Readme-UI 🎨

**Readme-UI** is an Open Source platform that generates beautiful, dynamic, and render-ready widgets for your GitHub Profile READMEs. Built with Next.js 14, TailwindCSS, and Satori, it turns React components into SVGs/PNGs instantly on the Edge.

### ✨ Features
- **Live Playground:** Real-time visual editor to customize your widgets.
- **Dynamic Data:** Fetches real-time data from external APIs (GitHub, Spotify, etc.).
- **Theme Support:** Native Dark & Light mode for all templates.
- **Zero Latency:** Runs on Vercel Edge Functions for instant rendering.
- **Custom Fonts:** Uses *Instrument Sans* for a premium look.

---

## 🚀 Getting Started

### 1. Create a Widget
Go to the **[Live Playground](http://localhost:3000)** (if running locally) or the deployed URL.
Select a template (e.g., Spotify Card, GitHub Stats), customize the fields, and copy the Markdown snippet.

### 2. Embed in README.md
Paste the generated code into your GitHub Profile README:

```markdown
![My Spotify Status](https://readme-ui.com/api/render?template=spotify&status=Focusing&title=Coding+Mode&theme=dark)
```

---

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/readme-ui.git
   cd readme-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the dev server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 📚 API Reference

**Endpoint:** `GET /api/render`

### Global Parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `template` | `string` | `spotify` | The ID of the template to render (see below). |
| `width` | `number` | `800` | Width of the generated image. |
| `height` | `number` | `400` | Height of the generated image. |

### Templates

#### 1. Spotify Card (`template=spotify`)
A glassmorphism-style music player card.
- `status`: Text to show at top (e.g., "Listening on Spotify")
- `title`: Song title
- `artist`: Artist name
- `progress`: Number 0-100
- `coverUrl`: URL of the album art image
- `theme`: `dark` | `light`

#### 2. GitHub Stats (`template=github`)
Displays user statistics fetching real data from GitHub API.
- `username`: Your GitHub username (Required for auto-fetch)
- `theme`: `dark` | `light`

---

## 🤝 Contributing
We welcome new templates!
1. Create a new file in `templates/MyNewCard.tsx`.
2. Register it in `lib/registry.ts`.
3. Open a Pull Request!

License: MIT
