import { SpotifyCard } from "@/templates/SpotifyCard";

// Define the registry of available templates
// Key is the ?template=XYZ identifier
export const templateRegistry: Record<string, React.FC<any>> = {
  spotify: SpotifyCard,
  "spotify-glass": SpotifyCard, // Alias for now
  // Future: github-stats, wakatime, etc.
};

export type TemplateKey = keyof typeof templateRegistry;
