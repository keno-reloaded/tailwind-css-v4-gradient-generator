interface ImportMetaEnv {
  VITE_PUBLIC_POSTHOG_KEY: string;
  VITE_PUBLIC_POSTHOG_HOST: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
