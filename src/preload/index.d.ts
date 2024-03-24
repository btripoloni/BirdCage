import { ElectronAPI } from '@electron-toolkit/preload'
import { BirdCageApi } from './BirdCageApi'

declare global {
  interface Window {
    electron: ElectronAPI
    birdCageApi: BirdCageApi
  }
}
