# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
## Install Electron
```npm 
npm install electron --save-dev
```
We don't want it to be installed globally. If you want a global electron, use `npm install -g electron` instead.

## Configure the Electron project
1. Create a new directory under `src` called `ui` or `renderer`.
2. Move all the files, assets directory, `index.ts` etc under the `src` into `ui` or `renderer`.
3. Create another directory under `src` called `electron` or `main`. this is where our main.ts file will live.

### Configure the tsconfig.json
Add the following to the tsconfig.json file
```json
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "NodeNext",
    "allowJs": true,
    "checkJs": true,        // enables IntelliSense & inline checking in JS
    "allowSyntheticDefaultImports": true
  },
  "include": ["src"],
  "exclude": ["src/electron"],
```
This will allow us to use JS files in our electron project. It will also exclude the electron directory from the tsconfig.json file.

### Configure the electronic tsconfig.json
- Create a new tsconfig.json file in the electron directory.
- Add the following to the tsconfig.json file
```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ESNext", // Tell TypeScript to generate ESNext syntax
    "module": "NodeNext", // Tell TypeScript to require ESNext syntax as input (including .js files import/export)
    "outDir": "../../dist-electron",
    "skipLibCheck": true, // Skip type checking of all declaration files (*.d.ts) and dependencies.
  }
}
```
Also tell the package.son to transpile the electron directory, by adding to the script in the package.json:
`"transpileElectron": "tsc -p src/electron/tsconfig.json"`.

Run `npm run transpileElectron` or `npm run transpile:electron` to transpile the electron directory.

### Complete the project to run the generated electron app in the dist-electron/main.ts file.
Change the main entry point in the package.json file to `dist-electron/main.js`.
From:
```json
{
  ...
  "name": "desktop-app-demo",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "main": "./src/electron/main",
   ...
}
```
To:
```json
{
  ...
  "name": "desktop-app-demo",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "main": "dist-electron/main.js",
   ...
}
```

### Lastly before the app development begins set up the electron builders.
Run `npm install vite-plugin-electron-builder --save-dev` or `npm install electron-builder --save-dev` in the root directory.
Run `npm install` in the electron directory.

### Add an electron-builder.json file
Add `electron-builder.json` file in the electron directory.
```json
{
  "appId": "bom.meld-tech.demo",
  "files": ["dist-electron/**/*", "dist-react/**/*"],
  "icon": "./public/favicon.ico",
  "mac": {
    "target": "dmg"
  },
  "linux": {
    "target": "AppImage",
    "category": "Utility"
  },
  "win": {
    "target": ["portable", "nsis", "msi"]
  }
}
```
Add the following to the package.json file scripts:
```json
{
  "scripts": {
    "dist:mac": "npm run transpileElectron && npm run build && electron-builder --mac --arm64",
    "dist:linux": "npm run transpileElectron && npm run build && electron-builder --linux --x64",
    "dist:win": "npm run transpileElectron && npm run build && electron-builder --win --x64"
  }
}
```

### Efficient Development with Cross environment Hot Reload
To efficiently develop with cross environment hot reload, where we don't need to rebuild the electron app every time we 
make a change in the react app, we will install `npm install cross-env --save-dev` package.
Might still need to start the react app separately and the electron will pick it up from there.
In the package.json scripts:
```json
{
  "scripts": {
    "dev:electron": "NODE_ENV=development electron ."
  }
}
```
This will run in development mode.
Create a util file for example `src/electron/utils.ts` and add the following:
```ts
export function isDev(): boolean {
    return process.env.NODE_ENV === 'development';
}
```

in the main.js file:
```ts
import {isDev} from "./util.js";

app.on('ready', () => {
    const mainWin = new BrowserWindow({width: 800, height: 600})
    if(isDev()) {
        mainWin.loadURL('http://localhost:5173')
    }
    else mainWin.loadFile(path.join(app.getAppPath() + '/dist-react/index.html'))
});
```

Start the electron app with `npm run dev:electron`. Notice it will be blank.
So start vite react app with `npm run dev:react` and it will load the React app.

### Combine all terminals commands
```bash
npm run dev:electron & npm run dev:react
```
More efficient development (Recommended).
```bash
npm install npm-run-all --save-dev
```

Then add and modify the following to the package.json Scripts:
```json
{
  "scripts": {
    "dev": "npm-run-all -p dev:react dev:electron",
    "dev:react": "vite",
    "dev:electron": "npm run transpileElectron; NODE_ENV=development electron . --import ./loader-register.mjs",
    "build": "tsc -b && vite build",
    "lint": "eslint ."
  }
}
```

