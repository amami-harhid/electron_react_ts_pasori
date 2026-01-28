# TROUBLE

```
App threw an error during load
Error: The module '\\?\D:\pasori\electron_react_ts_pasori\Release\better_sqlite3.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION 137. This version of Node.js requires
NODE_MODULE_VERSION 143. Please try re-compiling or re-installing
the module (for instance, using `npm rebuild` or `npm install`).
    at process.func [as dlopen] (node:electron/js2c/node_init:2:2617)
    at Module._extensions..node (node:internal/modules/cjs/loader:1929:18)
    at Object.func [as .node] (node:electron/js2c/node_init:2:2617)
    at Module.load (node:internal/modules/cjs/loader:1488:32)
    at Module._load (node:internal/modules/cjs/loader:1307:12)
    at c._load (node:electron/js2c/node_init:2:17999)
    at Module._load (D:\pasori\electron_react_ts_pasori\node_modules\runtime-required\runtime-required.js:34:23)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:252:24)
    at Module.require (node:internal/modules/cjs/loader:1511:12)
[electronmon] uncaught exception occured
```

# STEP01

`npm install`を実行、`electron-rebuild`を実行、`better-sqlite3\build\Release`をトップにコピー。

```
npm install
.\node_modules\.bin\electron-rebuild

cp .\node_modules\better-sqlite3\build\Release\* .\Release
```

```
npm run dev
```
⇒ 起動した。


