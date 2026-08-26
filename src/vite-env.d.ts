/// <reference types="vite/client" />

/**
 * Variables d'environnement du build.
 *
 * Toutes optionnelles : l'outil fonctionne sans, l'instrumentation reste
 * simplement inerte. Voir .env.example.
 */
interface ImportMetaEnv {
  /** URL du serveur Umami auto-hébergé, sans barre finale. */
  readonly VITE_UMAMI_URL?: string;
  /** Identifiant du site déclaré dans Umami. */
  readonly VITE_UMAMI_WEBSITE_ID?: string;
  /** Point d'entrée qui insère un relevé anonyme dans la table du baromètre. */
  readonly VITE_METRON_COLLECT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
