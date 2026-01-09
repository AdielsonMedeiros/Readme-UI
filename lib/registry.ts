import { GithubStats } from "@/templates/GithubStats";
import { SocialLinks } from "@/templates/SocialLinks";
import { SpotifyCard } from "@/templates/SpotifyCard";
import { TechStack } from "@/templates/TechStack";
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
};

export type TemplateKey = keyof typeof templateRegistry;
