import { IpcMain, IpcMainEvent, Menu, MenuItem, shell, clipboard, BrowserWindow } from 'electron'

export interface ContextMenuData {
  type: 'link' | 'text' | 'image'
  linkURL?: string
  textContent?: string
  srcURL?: string
}

interface ContextMenuTypes {
  link: Menu
  text: Menu
  image: Menu
}

const contextMenu: ContextMenuTypes = {
  link: new Menu(),
  text: new Menu(),
  image: new Menu()
}

let contextData: ContextMenuData = {}

export function ContextMenu(ipc: IpcMain, mainWindow: BrowserWindow): void {
  createContextMenu(mainWindow)
  openContextmenu(ipc)
}

function openContextmenu(ipc: IpcMain): void {
  ipc.on('contextMenu:open', (_event: IpcMainEvent, contextMenuData: ContextMenuData) => {
    contextData = contextMenuData
    const menuType = contextMenuData.type
    contextMenu[menuType].popup()
  })
}

function createContextMenu(mainWindow: BrowserWindow): void {
  contextMenu.image.append(
    new MenuItem({
      label: 'Open Link in a Browser',
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      click: () => {
        if (contextData.linkURL) shell.openExternal(contextData.linkURL)
      }
    })
  )

  contextMenu.image.append(
    new MenuItem({
      label: 'Copy Link Address',
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      click: () => {
        if (contextData.linkURL) clipboard.writeText(contextData.linkURL)
      }
    })
  )

  contextMenu.image.append(
    new MenuItem({
      type: 'separator'
    })
  )

  contextMenu.image.append(
    new MenuItem({
      label: 'Save Image',
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      click: () => {
        if (contextData.srcURL) mainWindow.webContents.downloadURL(contextData.srcURL, {})
      }
    })
  )

  contextMenu.image.append(
    new MenuItem({
      label: 'Copy Image Address',
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      click: () => {
        if (contextData.linkURL) clipboard.writeText(contextData.linkURL)
      }
    })
  )

  contextMenu.link.append(
    new MenuItem({
      label: 'Open Link in a Browser',
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      click: () => {
        if (contextData.linkURL) shell.openExternal(contextData.linkURL)
      }
    })
  )

  contextMenu.link.append(
    new MenuItem({
      label: 'Copy Link Address',
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      click: () => {
        if (contextData.linkURL) clipboard.writeText(contextData.linkURL)
      }
    })
  )

  contextMenu.text.append(
    new MenuItem({
      label: 'Copy Selected Text',
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      click: () => {
        if (contextData.textContent) clipboard.writeText(contextData.textContent)
      }
    })
  )
}
