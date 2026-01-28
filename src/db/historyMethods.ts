import type { HistoryRow } from './historyRow';
import type { CardRow } from './cardRow';
import { cards } from './cardMethods';
import { type TchangesInfo, getChangeInfo } from "./changesInfo";
import { dateUtils } from '../utils/dateUtils';
import { db } from './db';

const dropTable = () => {
    const query = `DROP TABLE IF EXISTS histories`
    try{
        const dropQuery = db.prepare(query);
        dropQuery.run();
        return;
    }catch(err){
        console.log(err);
        throw err;
    }
}
const createTable = ()=>{
    const query =             
            `CREATE TABLE
            IF NOT EXISTS histories
            (
                [id] integer primary key autoincrement,
                [idm] text,
                [fcno] text,
                [in_room] boolean,
                [date_in] date,
                [date_out] date,
                [date_time] datetime
            );`
    try{
        const createQuery = db.prepare(query);
        createQuery.run();
        return;
    }catch(err){
        console.log(err);
        throw err;
    }
};

const selectAll = ():Array<HistoryRow> => {
    const query = "SELECT * FROM histories ORDER BY fcno, date_in ASC;";
    try{
        const readQuery = db.prepare(query)
        const rowList = readQuery.all() as Array<HistoryRow>
        return rowList
    }catch(err){
        console.log(err);
        throw err;
    }
};
const selectInRoomHistoriesByIdm = (idm:string, date:string):Array<HistoryRow> => {
    let query = `SELECT * FROM histories
        WHERE idm = ? AND date_in = ?`;
    try{
        const readQuery = db.prepare(query)
        const rowList = readQuery.all(idm, date) as Array<HistoryRow>;
        return rowList;
    }catch(err){
        console.log(err);
        throw err;
    }
}
const selectHistoriesByFcno = (fcno:string):Array<HistoryRow> => {
    const query = `SELECT * FROM histories WHERE fcno = ?`;
    try{
        const readQuery = db.prepare(query)
        const rowList = readQuery.all(fcno) as Array<HistoryRow>;
        return rowList;
    }catch(err){
        console.log(err);
        throw err;
    }
}
const selectHistoriesByFcnoSameDate = (fcno:string, date:string):Array<HistoryRow> => {
    const query = `SELECT * FROM histories WHERE fcno = ? AND date_in = ?`;
    try{
        const readQuery = db.prepare(query)
        const rowList = readQuery.all(fcno, date) as Array<HistoryRow>;
        return rowList;
    }catch(err){
        console.log(err);
        throw err;
    }
}
const insert = (data: HistoryRow):TchangesInfo => {
    const resultInfo = getChangeInfo();
    const rows = selectHistoriesByFcnoSameDate(data.fcno, data.date_in);
    if(rows.length > 0){
        return resultInfo;
    }
    const query = 
     `INSERT INTO histories
            (idm, fcno, in_room, date_in, date_out, date_time)
            VALUES (?, ?, ?, ?, ?, datetime('now', 'localtime'));`
    try{
        const insertQuery = db.prepare(query);
        const transaction = db.transaction(()=>{
            const info = insertQuery.run(
                        data.idm, 
                        data.fcno, 
                        data.in_room, 
                        data.date_in, 
                        data.date_out, 
                        data.idm
                    );
            console.log(`Inserted ${info.changes} rows with last ID ${info.lastInsertRowid} into cards`);
            resultInfo.changes = info.changes;
            resultInfo.lastInsertRowid = info.lastInsertRowid as number;
        });
        transaction();
        return resultInfo;
    }catch(err){
        console.log("err=", err);
        throw err;
    }
}
const updateByFcnoDate = (data: HistoryRow):TchangesInfo => {
    const resultInfo = getChangeInfo();
    const query = 
     `UPDATE histories SET in_room=?, date_out=?, date_time=datetime('now', 'localtime')
        WHERE fcno = ? AND date_in=?`;
    try{
        const updateQuery = db.prepare(query);
        const transaction = db.transaction(()=>{
            const info = updateQuery.run(data.in_room,data.date_out,data.fcno,data.date_in);
            resultInfo.changes = info.changes;
        });
        transaction();
        return resultInfo;
    }catch(err){
        console.log(err);
        throw err;
    }
}
const deleteByFcnoDate = (fcno:string, date_in:string):TchangesInfo => {
    const resultInfo = getChangeInfo();
    const query = `DELETE FROM cards WHERE fcno = ? AND date_in=?`;
    try{
        const deleteQuery = db.prepare(query);
        const transaction = db.transaction(()=>{
            const info = deleteQuery.run(fcno,date_in);
            resultInfo.changes = info.changes;
            resultInfo.lastInsertRowid = info.lastInsertRowid as number;
        });
        transaction();
        return resultInfo;
    }catch(err){
        console.log(err);
        throw err;
    }
}
const setTodayInRoomByIdm = (idm:string):TchangesInfo => {
    const resultInfo = getChangeInfo();
    const cardRows = cards.selectCardsByIdm(idm);
    if(cardRows.length==0){
        // カードの登録がないとき
        return resultInfo;
    }
    const toDay = dateUtils.dateFormatter(new Date());
    const toDayInRooms = selectInRoomHistoriesByIdm(idm, toDay)
    if( toDayInRooms.length == 0){
        // 本日の入室の履歴がないとき
        const _card = cardRows[0];
        const _fcno = _card.fcno;
        const queryInsert = 
        `INSERT INTO histories
        (idm, fcno, in_room, date_in, date_out, date_time)
        VALUES (?, ?, TRUE, date(CURRENT_DATE), NULL, datetime('now', 'localtime'))`;
        try{
            const insertPrepare = db.prepare(queryInsert);
            const transaction = db.transaction(()=>{
                const info = insertPrepare.run(idm,_fcno);
                resultInfo.changes = info.changes;
                resultInfo.lastInsertRowid = info.lastInsertRowid as number;
            });
            transaction();
            return resultInfo;
        }catch(err){
            console.log(err);
            throw err;
        }
    }else{
        // 本日に入室があるとき
        const _card = cardRows[0];
        const _fcno = _card.fcno;
        const queryUpdate = 
        `UPDATE histories
        SET in_room = TRUE, date_out = NULL, date_time = datetime('now', 'localtime')
        WHERE idm = ? AND date_in = date(CURRENT_DATE)`;
        try{
            const updatePrepare = db.prepare(queryUpdate);
            const transaction = db.transaction(()=>{
                const info = updatePrepare.run(idm);
                resultInfo.changes = info.changes;
                resultInfo.lastInsertRowid = info.lastInsertRowid as number;        
            });
            transaction();
            return resultInfo;
        }catch(err){
            console.log(err);
            throw err;
        }
    }
}
export const histories = {
    dropTable: dropTable,
    createTable: createTable,
    deleteByFcnoDate: deleteByFcnoDate,
    selectAll: selectAll,
    selectHistoriesByFcno: selectHistoriesByFcno,
    /** 本日の入室履歴を作る */
    setTodayInRoomByIdm: setTodayInRoomByIdm,
    insert: insert,
    updateByFcnoDate: updateByFcnoDate,
}

