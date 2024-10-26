import _json from "build-system-env";
const env = _json as Record<string, string>;
Object.assign(import.meta, { env });

declare global {
  interface ImportMetaEnv {
    [key: string]: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
