import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

const electronApiNavigate = {
  onNavigate: (callback:CallableFunction) => {
    ipcRenderer.on("navigate", (_, path) => {
      console.log('path=',path);
      callback(path)
    })
  },
};

contextBridge.exposeInMainWorld("electronAPI", electronApiNavigate);

export type ElectronApiNavigate = typeof electronApiNavigate;