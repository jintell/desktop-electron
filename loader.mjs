import { fileURLToPath, pathToFileURL } from "url";
import fs from "fs";
import path from "path";

export async function resolve(specifier, context, nextResolve) {
    // If a relative import without extension
    if (
        specifier.startsWith("./") ||
        specifier.startsWith("../") ||
        specifier.startsWith("/")
    ) {
        const resolved = fileURLToPath(
            new URL(specifier, context.parentURL)
        );

        const possible = [
            resolved,
            resolved + ".js",
            resolved + ".mjs",
            resolved + ".cjs",
            path.join(resolved, "index.js")
        ];

        for (const p of possible) {
            if (fs.existsSync(p)) {
                return {
                    url: pathToFileURL(p).href
                };
            }
        }
    }

    // fallback to default loader
    return nextResolve(specifier, context);
}