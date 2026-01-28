import Store from "electron-store";

const store = new Store();

export interface StoreSave {
  [name: string]: string;
}

const save = (obj:StoreSave):void => {
    for(const key in obj){
        const value:string = obj[key];
        store.set(key, value)
    }
}

const get = (key:string) => {
    if(store.has(key)){
        return store.get(key);
    }
    throw new Error(`NOT FOUND key=(${key})`);
}
const has = (key:string):boolean => {
    return store.has(key);
}
export const ApConfig = {
    get : get,
    save : save,
    has: has,
}
