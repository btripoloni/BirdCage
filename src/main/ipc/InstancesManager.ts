import fs from 'fs'
import { Instances } from '../../renderer/src/types/Instances'
import { app } from 'electron'
import path from 'path'

let instacesPath: string = ''

export function InstacesManager(ipc: Electron.IpcMain): void {
  instacesPath = path.join(userPath(), 'instances.json')
  SaveInstaces(ipc)
  LoadInstaces(ipc)
}

function userPath(): string {
  let userDirectoryName: string = ''
  const plataformList = {
    win32: 'appData',
    linux: 'home'
  }
  const plataform = plataformList[process.platform]

  if (!plataform) return ''

  userDirectoryName = app.getPath(plataform)
  const userDirectoryPath = path.join(userDirectoryName, '.bird-cage')
  if (!fs.existsSync(userDirectoryPath)) {
    fs.mkdirSync(userDirectoryPath)
  }
  return userDirectoryPath
}

function SaveInstaces(ipc: Electron.IpcMain): void {
  ipc.on('instaces:save', (_event, instances: Instances[]) => {
    fs.writeFileSync(instacesPath, JSON.stringify(instances, null, 2))
  })
}

async function LoadInstaces(ipc: Electron.IpcMain): Promise<Instances[]> {
  console.log('loading Instances from:' + instacesPath)
  ipc.handle('instaces:load', () => {
    if (fs.existsSync(instacesPath)) {
      return JSON.parse(fs.readFileSync(instacesPath, 'utf8'))
    }
  })
  return []
}
