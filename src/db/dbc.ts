import electron from 'electron';
import type {IpcMainInvokeEvent} from 'electron';

// Main側(main.js), Render側(preload.js)の両方で import できるように
// 一度「electron」で受け取り、必要なプロパティを取り出す。

import { cards } from './cardMethods';
import { histories } from './historyMethods';
import { historyCards } from './historyCardMethods';
import type { DbMethods } from '../db/db';

type DbaArray = Promise<any>

const dbMathods:DbMethods = {}
for(const key in cards){
    dbMathods[key] = cards[key];
}
for(const key in histories){
    dbMathods[key] = cards[key];
}
for(const key in historyCards){
    dbMathods[key] = cards[key];
}

export class DBC {

    static async dbExecute(event:IpcMainInvokeEvent, methodName:string, ...args: Array<any>):DbaArray {
    for(const name in dbMathods) {
      if(methodName == name){
        const method = dbMathods[name];
        const val = method(args);
        return val;
      }
    }
    throw new Error(`Not Found method name=${methodName}`);
  }
  // Main側で宣言
  static onExecute() {
    const ipcMain = electron.ipcMain;
    ipcMain.on(DBC.dbExecute.name, DBC.dbExecute);
  }
  // Preload側で実行
  static async send(methodName:string, ...args:Array<any>): DbaArray {
    const ipcRenderer = electron.ipcRenderer;
    for(const name in dbMathods) {
      if(methodName == name){
        const result:DbaArray =  await ipcRenderer.invoke(methodName, args);
        return result;
      }
    }
    throw new Error(`Not Found method name=${methodName}`);
  }

}