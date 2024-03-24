import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { BirdCageApi } from './BirdCageApi'
import { Instances } from '../renderer/src/types/Instances'
// Custom APIs for renderer
const birdCageApi: BirdCageApi = {
  SaveInstances: (instances: Instances[]) => ipcRenderer.send('instaces:save', instances),
  LoadInstances: () => ipcRenderer.invoke('instaces:load')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('birdCageApi', birdCageApi)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = birdCageApi
}
