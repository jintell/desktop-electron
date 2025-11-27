import { register } from "node:module";
import { pathToFileURL } from "node:url";

// Register the loader relative to project root
register("./loader.mjs", pathToFileURL("./"));