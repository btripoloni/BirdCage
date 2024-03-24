export interface BirdCageApi {
  SaveInstances: (instances: Instances[]) => void
  LoadInstances?: () => Promise<Instances[]>
}
