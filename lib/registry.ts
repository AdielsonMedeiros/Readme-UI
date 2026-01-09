import { DevJoke } from "@/templates/DevJoke";
import { GithubStats } from "@/templates/GithubStats";
import { ProjectShowcase } from "@/templates/ProjectShowcase";
import { QuoteCard } from "@/templates/QuoteCard";
import { SocialLinks } from "@/templates/SocialLinks";
import { SpotifyCard } from "@/templates/SpotifyCard";
import { TechStack } from "@/templates/TechStack";
import { TypingText } from "@/templates/TypingText";
import { VisitorCounter } from "@/templates/VisitorCounter";
import { WaveBanner } from "@/templates/WaveBanner";

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
};

export type TemplateKey = keyof typeof templateRegistry;
