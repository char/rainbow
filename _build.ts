import { denoPlugins } from "jsr:@luca/esbuild-deno-loader@0.11";
import * as dotenv from "jsr:@std/dotenv@0.225.2";
import * as path from "jsr:@std/path@1";
import * as esbuild from "npm:esbuild@0.24";

export const envPlugin = (files: string[]): esbuild.Plugin => ({
  name: "env",
  setup: build => {
    build.onResolve({ filter: /^build-system-env$/ }, args => {
      return {
        path: args.path,
        namespace: "env-ns",
        watchFiles: files,
      };
    });

    build.onLoad({ filter: /.*/, namespace: "env-ns" }, async () => {
      const env = {};
      for (const file of files) {
        try {
          const loaded = await dotenv.load({ envPath: file, export: false });
          Object.assign(env, loaded);
        } catch {
          // ignore
        }
      }

      return {
        contents: JSON.stringify(env),
        loader: "json",
      };
    });
  },
});

export const cssPlugin = (): esbuild.Plugin => ({
  name: "css",
  setup: build => {
    const options = build.initialOptions;
    options.loader = { ...options.loader, ".woff": "file", ".woff2": "file" };

    build.onResolve({ filter: /\.css$/ }, args => {
      if (args.path.startsWith("https://")) {
        return { path: args.path, external: true };
      }

      return { path: path.join(args.resolveDir, args.path) };
    });

    build.onLoad({ filter: /\.css$/ }, args => {
      const loader = args.path.endsWith(".css") ? "css" : "file";
      return { loader };
    });
  },
});

export const build = async (
  watch: boolean = false,
  serve?: { host: string; port: number },
  prod?: boolean,
) => {
  const opts = {
    bundle: true,
    minify: true,
    target: "esnext",
    platform: "browser",
    format: "esm",
    keepNames: true,
    sourcemap: "linked",
    plugins: [
      envPlugin(prod ? [".env", ".env.production"] : [".env", ".env.local"]),
      cssPlugin(),
      ...denoPlugins(),
    ],
    entryPoints: ["./src/main.ts"],
    outdir: "./web/dist",
    legalComments: "none",
  } satisfies esbuild.BuildOptions;

  if (watch) {
    const ctx = await esbuild.context(opts);
    await ctx.watch();
    if (serve) {
      console.log(`Serving on http://${serve.host}:${serve.port}/ ...`);
      await ctx.serve({
        servedir: "./web",
        host: serve.host,
        port: serve.port,
        fallback: "./web/index.html",
      });
    }
  } else {
    await esbuild.build(opts);
  }
};

if (import.meta.main) {
  if (Deno.args.includes("--clean")) {
    try {
      await Deno.remove("./web/dist", { recursive: true });
    } catch {
      // ignore
    }
  }

  const watch = Deno.args.includes("--watch");
  const prod = Deno.args.includes("--prod");
  await build(watch, { host: "127.0.0.1", port: 3004 }, prod);
}
