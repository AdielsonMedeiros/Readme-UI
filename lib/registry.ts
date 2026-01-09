import { ActivityGraph } from "@/templates/ActivityGraph";
import { DevJoke } from "@/templates/DevJoke";
import { GithubStats } from "@/templates/GithubStats";
import { HackingTerminal } from "@/templates/HackingTerminal";
import { MusicVisualizer } from "@/templates/MusicVisualizer";
import { ProjectShowcase } from "@/templates/ProjectShowcase";
import { QuoteCard } from "@/templates/QuoteCard";
import { SnakeGame } from "@/templates/SnakeGame";
import { SocialLinks } from "@/templates/SocialLinks";
import { SpotifyCard } from "@/templates/SpotifyCard";
import { TechStack } from "@/templates/TechStack";
import { TypingText } from "@/templates/TypingText";
import { VisitorCounter } from "@/templates/VisitorCounter";
import { WaveBanner } from "@/templates/WaveBanner";
import { WeatherWidget } from "@/templates/WeatherWidget";

// Define the registry of available templates
// Key is the ?template=XYZ identifier
export const templateRegistry: Record<string, React.FC<any>> = {
  spotify: SpotifyCard,
  "spotify-glass": SpotifyCard,
  github: GithubStats,
  stack: TechStack,
  wave: WaveBanner,
  social: SocialLinks,
  quote: QuoteCard,
  project: ProjectShowcase,
  typing: TypingText,
  joke: DevJoke,
  visitors: VisitorCounter,
  hacking: HackingTerminal,
  weather: WeatherWidget,
  snake: SnakeGame,
  music: MusicVisualizer,
  activity: ActivityGraph,
};

export type TemplateKey = keyof typeof templateRegistry;
