export type TchangesInfo = {
  changes: number;
  lastInsertRowid: number;
}

export const getChangeInfo = ():TchangesInfo => {
  return {
    changes: -1,
    lastInsertRowid: -1,
  }
}