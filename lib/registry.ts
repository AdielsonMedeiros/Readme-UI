import { GithubStats } from "@/templates/GithubStats";
import { SpotifyCard } from "@/templates/SpotifyCard";
import { TechStack } from "@/templates/TechStack";

// Define the registry of available templates
// Key is the ?template=XYZ identifier
export const templateRegistry: Record<string, React.FC<any>> = {
  spotify: SpotifyCard,
  "spotify-glass": SpotifyCard,
  github: GithubStats,
  stack: TechStack,
};

export type TemplateKey = keyof typeof templateRegistry;
