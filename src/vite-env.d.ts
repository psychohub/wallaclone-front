/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }

  interface Window {
    __VITE_API_URL__?: string;
  }