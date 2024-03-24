import fs from 'fs'
import { Instances } from '../../renderer/src/types/Instances'

export function InstacesManager(ipc: Electron.IpcMain): void {
  SaveInstaces(ipc)
  LoadInstaces(ipc)
}

function SaveInstaces(ipc: Electron.IpcMain): void {
  ipc.on('instaces:save', (_event, instances: Instances[]) => {
    fs.writeFileSync('./instances.json', JSON.stringify(instances, null, 2))
  })
}

async function LoadInstaces(ipc: Electron.IpcMain): Promise<Instances[]> {
  ipc.handle('instaces:load', () => {
    if (fs.existsSync('./instances.json')) {
      return JSON.parse(fs.readFileSync('./instances.json', 'utf8'))
    }
  })
  return []
}
