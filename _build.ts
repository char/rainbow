import { build, cssPlugin, envPlugin } from "@char/aftercare/esbuild";

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
  await build({
    in: ["./src/main.ts"],
    outDir: "./web/dist",
    watch,
    plugins: [envPlugin([".env", prod ? ".env.production" : ".env.local"]), cssPlugin()],
    serve: { host: "127.0.0.1", port: 3004, fallback: "./web/index.html", servedir: "./web" },
  });
}
