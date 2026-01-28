import {app} from 'electron';
import Database from "better-sqlite3";
import type { CardRow } from './cardRow';

const db_path = app.getPath('userData');

export const db = new Database(`${db_path}/testdb.db`);
export interface DbMethods {
  [name: string]: CallableFunction;
}
import {cards} from './cardMethods';
export const test = async () =>{
    cards.dropTable();
    cards.createTable();
    const info01 = cards.deleteByFcno('12345');
    console.log("info01=",info01);
    const info02 = cards.deleteByFcno('55555');
    console.log("info02=",info02);

    const rows = cards.selectAll();
    console.log("rows=", rows);
    const testRows:CardRow[] = [
        {
        id: '123',
        fcno:'12345',
        name:'Test Taro',
        kana:'テストタロウ',
        mail:'aaaa@test.com',
        in_room: true,
        idm:'0000000000000000',
        date_time:'2026-01-28 09:10:10'
        },
        {
        id: '321',
        fcno:'55555',
        name:'Test Jiro',
        kana:'テストジロウ',
        mail:'bbbb@test.com',
        in_room: false,
        idm:'0000000000000001',
        date_time:'2026-01-28 11:10:10'
        },
        {
        fcno:'55555',
        name:'Test SabuJiro',
        kana:'テストサブジロウ',
        mail:'bbbb@test.com',
        in_room: false,
        idm:'0000000000000002',
        date_time:'2026-01-28 11:10:10'
        },
    ]
    for(const row of testRows){
        const info = cards.insert(row);
        console.log("insert info=", info);

    }
    const rows2 = cards.selectAll();
    console.log("rows2=",rows2);

    const data:CardRow = {
        fcno: "55555",
        name: "XXXXX",
        kana: "kana",
        mail: "kkkkk@bbbb.jp",
        in_room: false,
        idm: "9999999999999999",
    };
    const info03 = cards.updateByFcno(data);
    console.log("info03=", info03)
    const rows03 = cards.selectAll();
    console.log("rows03=", rows03);

}