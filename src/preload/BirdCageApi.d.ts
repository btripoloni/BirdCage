export interface BirdCageApi {
  SaveInstances: (instances: Instances[]) => void
  LoadInstances?: () => Promise<Instances[]>
  openContextMenu: (ContextMenuData: ContextMenuData) => void
}
