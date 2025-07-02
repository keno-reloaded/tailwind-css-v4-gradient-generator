interface ImportMetaEnv {
  VITE_PUBLIC_POSTHOG_KEY: string;
  VITE_PUBLIC_POSTHOG_HOST: string;
  MODE: string; // Add this line
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
