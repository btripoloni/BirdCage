import { useEffect, useState } from 'react'
import { XFrame } from './components/XFrame'
import { PlusCircleIcon } from 'lucide-react'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable'
import { Instances } from './types/Instances'

function App(): JSX.Element {
  // { session, id }
  const [instances, SetInstances] = useState<Instances[]>([])
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  useEffect(() => {
    loadInstances()
  }, [])

  function handleNewInstance(): void {
    SetInstances((instances) => {
      const newInstace = {
        session: Date.now().toString(),
        id: Date.now().toString(),
        url: 'https://x.com'
      }
      const newInstaces = [...instances, newInstace]
      saveInstances(newInstaces)
      return newInstaces
    })
  }

  function closeInstace(id: string): void {
    console.log('close', id)
    SetInstances((instances) => {
      const newInstancies = instances.filter((instance) => instance.id !== id)
      saveInstances(newInstancies)
      return newInstancies
    })
  }

  function duplicateInstace(id: string): void {
    SetInstances((instances) => {
      const instanceIndex = instances.findIndex((instance) => instance.id === id)
      const instance = instances[instanceIndex]
      const newInstace = {
        session: instance.session,
        id: Date.now().toString(),
        url: instance.url
      }
      const beforeInstace = instances.slice(0, instanceIndex + 1)
      const afterInstace = instances.slice(instanceIndex + 1)
      const newInstacies = [...beforeInstace, newInstace, ...afterInstace]
      saveInstances(newInstacies)
      return newInstacies
    })
  }

  function handleDragEnd(event): void {
    const { active, over } = event

    if (active.id !== over.id) {
      SetInstances((instances) => {
        const newIndex = instances.findIndex((instance) => instance.id === over.id)
        const oldIndex = instances.findIndex((instance) => instance.id === active.id)
        const newInstances = arrayMove(instances, oldIndex, newIndex)
        saveInstances(newInstances)
        return newInstances
      })
    }
  }

  function saveInstances(newInstacies: Instances[] = instances): void {
    //localStorage.setItem('instances', JSON.stringify(instances))
    window.birdCageApi.SaveInstances(newInstacies)
  }

  function loadInstances(): void {
    //SetInstances(JSON.parse(localStorage.getItem('instances') || '[]'))
    //SetInstances(BCApi.LoadInstances())
    if (!window.birdCageApi.LoadInstances) return
    window.birdCageApi.LoadInstances().then((instances) => {
      if (instances) {
        SetInstances(instances)
      }
    })
  }

  function handleNavigate(id: string, url: string): void {
    SetInstances((instances) => {
      const instanceIndex = instances.findIndex((instance) => instance.id === id)
      const newInstaces = [...instances]
      newInstaces[instanceIndex].url = url
      saveInstances(newInstaces)
      return newInstaces
    })
  }

  return (
    <>
      <div className="scrollbar scrollbar-thumb-rounded-full scrollbar-thumb-light-black hover:scrollbar-thumb-blue scrollbar-track-black overflow-x-scroll ">
        <div className="flex min-w-full w-fit h-[calc(100vh-16px)]  bg-black text-white p-3 gap-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={instances} strategy={horizontalListSortingStrategy}>
              {instances.map((instace) => {
                return (
                  <XFrame
                    key={instace.id}
                    id={instace.id}
                    session={instace.session}
                    url={instace.url}
                    onClose={closeInstace}
                    onDuplicate={duplicateInstace}
                    onNavigate={handleNavigate}
                  />
                )
              })}
            </SortableContext>
          </DndContext>
          <div>
            <button
              className="min-w-96 bg-black h-[calc(100%)] border-4 rounded-xl text-blue justify-center flex flex-col items-center opacity-35 hover:opacity-100 transition-opacity"
              onClick={handleNewInstance}
            >
              <span className="mb-2">
                <PlusCircleIcon size={'3rem'} />
              </span>
              <span>Create a new X Instance</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
