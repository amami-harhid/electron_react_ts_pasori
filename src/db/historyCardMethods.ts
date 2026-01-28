import type { HistoryCardRow } from './historyCardRow';
import { db, type DbMethods } from './db';

const selectInRoomHistoriesByDate = (date:string):Array<HistoryCardRow> => {
    const query = 
        `SELECT 
        H.fcno,
        C.name,
        C.kana,
        H.date_in,
        H.date_out 
        FROM histories AS H
        LEFT OUTER JOIN cards AS C
        WHERE H.date_in = date(?) 
        AND H.fcno = C.fcno
        ORDER BY C.kana ASC`;
    try{
        const readQuery = db.prepare(query)
        const rowList = readQuery.all(date) as Array<HistoryCardRow>;
        return rowList;
    }catch(err){
        console.log(err);
        throw err;
    }
}
export const historyCards:DbMethods = {
    selectInRoomHistoriesByDate: selectInRoomHistoriesByDate,
}

