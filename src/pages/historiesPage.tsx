import { JSX, useMemo, useRef, useEffect, useState, ChangeEvent } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_TableInstance,
} from 'material-react-table';

import { DBC } from '../db/dbc';
import { type HistoryCardRow } from '../db/historyCardRow';

// データの型定義
interface History {
  no: string;
  fcno: string;
  name: string;
  kana: string;
  room_in: string;
  room_out: string;
}

// テーブルに渡すデータ
const data: History[] = [];

export async function Histories() {

  // カラムの定義
  const columns = useMemo<MRT_ColumnDef<History>[]>(
    ()=>[
      // keyを直接指定する場合
      {
        accessorKey: 'no',
        header: 'NO',
        muiTableHeadCellProps: { style: { color: 'green' } },
        enableHiding: false,
        size:25,
      },
      {
        accessorKey: 'fcno',
        header: 'FCNO',
        muiTableHeadCellProps: { style: { color: 'green' } },
        enableHiding: false,
        size:25,
      },
      {
        accessorKey: 'name',
        header: '名前',
        muiTableHeadCellProps: { style: { color: 'green' } },
        enableHiding: false,
        size:200,
      },
      {
        accessorKey: 'kana',
        header: 'カナ',
        muiTableHeadCellProps: { style: { color: 'green' } },
        enableHiding: false,
        size:200,
      },
      {
        accessorKey: 'room_in',
        header: '入室',
        muiTableHeadCellProps: { style: { color: 'green' } },
        enableHiding: false,
        size:50,
      },
      {
        accessorKey: 'room_out',
        header: '退室',
        muiTableHeadCellProps: { style: { color: 'green' } },
        enableHiding: false,
        size:50,
        enableColumnOrdering: false, // ソート順変更不可
      },
  ],
  [],);

  const [selectDate, setSelectDate] = useState("");

  const histories_inputDate_change = async (e:ChangeEvent<HTMLInputElement>) => {
    if(e != null && e.target != null){
      const _date = e.target.value;
      setSelectDate(_date)
    }
  }
  const getHistories = async (_date:string): Promise<Array<History>> => {
    const histories:Array<HistoryCardRow> =
              await DBC.send('selectInRoomHistoriesByDate', _date);
    let count = 0;
          const data:Array<History> = [];
          for(const row of histories){
            count += 1;
            const _d:History = {
              no: String(count).padStart(4,"0"),
              fcno: (row.fcno)?row.fcno:'',
              name: (row.name)?row.name:'',
              kana: (row.kana)?row.kana:'',
              room_in: (row.date_in)?row.date_in:'',
              room_out: (row.date_out)?row.date_out:'',
            }
            data.push(_d)
          }
    return data;
  }

  const tableGenerator = async (date:string): Promise<MRT_TableInstance<History>> => {

    const data = await getHistories(date);
    // テーブルの定義
    const table = useMaterialReactTable({
      columns,
      data,
      enableRowSelection: false, // 選択BOXを表示しない
      enableGlobalFilter: false, // 横断検索対象外
      enableColumnOrdering: false, // ソート順変更不可
    });
    return table
  }

  const table = await tableGenerator(selectDate);

  // コンポーネントに定義したtableをpropsで渡す
  return (
      <div className="Histories">
        <label htmlFor="histories_inputDate">日付を選択してください:</label>
        <input onChange={histories_inputDate_change} type="date" id="histories_inputDate"/>
        <p>選択された日付: <span id="histories_dateResult">{selectDate}</span></p>
        <div className="Histories_table">
          <MaterialReactTable table={table} />
        </div>
      </div>

  );
}
