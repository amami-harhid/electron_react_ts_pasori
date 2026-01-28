import path from "node:path";
import { BrowserWindow, app } from "electron";
import { MenuBuilder } from "./pages/menu";

import {test} from './db/db';

app.whenReady().then(() => {
  // アプリの起動イベント発火で BrowserWindow インスタンスを作成
  const mainWindow = new BrowserWindow({
    webPreferences: {
      // webpack が出力したプリロードスクリプトを読み込み
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // メニュー
  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
  
  // レンダラープロセスをロード
  mainWindow.loadFile("dist/index.html");

  test();

  mainWindow.webContents.send("navigate", "/");
});

// すべてのウィンドウが閉じられたらアプリを終了する
app.once("window-all-closed", () => app.quit());