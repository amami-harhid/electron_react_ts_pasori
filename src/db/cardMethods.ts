import type { CardRow } from './cardRow';
import { type TchangesInfo, getChangeInfo } from "./changesInfo";
import { db } from './db';

const dropTable = () => {
    const query = `DROP TABLE IF EXISTS cards`
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
            IF NOT EXISTS cards
            (
                [id] integer primary key autoincrement,
                [fcno] text UNIQUE,
                [name] text,
                [kana] text,
                [mail] text,
                [in_room] boolean,
                [idm] text,
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

const selectAll = () => {
    const query = "SELECT * FROM cards ORDER BY kana ASC;";
    try{
        const readQuery = db.prepare(query)
        const rowList = readQuery.all()
        return rowList
    }catch(err){
        console.log(err);
        throw err;
    }
};
const selectCardsByIdm = (idm:string):Array<CardRow> => {
    const query = `SELECT * FROM cards WHERE idm = ?`;
    try{
        const readQuery = db.prepare(query)
        const rowList = readQuery.all(idm) as Array<CardRow>;
        return rowList;
    }catch(err){
        console.log(err);
        throw err;
    }
}
const selectCardsByFcno = (fcno:string):Array<CardRow> => {
    const query = `SELECT * FROM cards WHERE fcno = ?`;
    try{
        const readQuery = db.prepare(query)
        const rowList = readQuery.all(fcno) as Array<CardRow>;
        return rowList;
    }catch(err){
        console.log(err);
        throw err;
    }
}
const insert = (data: CardRow):TchangesInfo => {
    const resultInfo = getChangeInfo();

    const rows = selectCardsByFcno(data.fcno);
    if(rows.length > 0){
        return resultInfo;
    }
    const query = 
     `INSERT INTO cards
            (fcno, name, kana, mail, in_room, idm, date_time)
            VALUES (?, ?, ?, ?, ?, ?, datetime('now', 'localtime'));`
    try{
        const insertQuery = db.prepare(query);
        const transaction = db.transaction(()=>{
            const info = insertQuery.run(
                        data.fcno, 
                        data.name, 
                        data.kana, 
                        data.mail, 
                        (data.in_room)? 1:0, 
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
const updateByFcno = (data: CardRow):TchangesInfo => {
    const resultInfo = getChangeInfo();
    const query = 
     `UPDATE cards SET name=?, kana=?, mail=?, in_room=?, idm=?, date_time=datetime('now', 'localtime')
        WHERE fcno = ?`;
    try{
        const updateQuery = db.prepare(query);
        const transaction = db.transaction(()=>{
            const info = updateQuery.run(
                data.name,
                data.kana,
                data.mail,
                (data.in_room)?1:0,
                data.idm,
                data.fcno);
            resultInfo.changes = info.changes;
        });
        transaction();
        return resultInfo;
    }catch(err){
        console.log(err);
        throw err;
    }
}
const deleteByFcno = (fcno:string):TchangesInfo => {
    const resultInfo = getChangeInfo();
    const query = `DELETE FROM cards WHERE fcno = ?`;
    try{
        const deleteQuery = db.prepare(query);
        const transaction = db.transaction(()=>{
            const info = deleteQuery.run(fcno);
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
export const cards = {
    dropTable: dropTable,
    createTable: createTable,
    selectAll: selectAll,
    selectCardsByIdm: selectCardsByIdm,
    selectCardsByFcno: selectCardsByFcno,
    insert: insert,
    updateByFcno: updateByFcno,
    deleteByFcno: deleteByFcno,

    
}

