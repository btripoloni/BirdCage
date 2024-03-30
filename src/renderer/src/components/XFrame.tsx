import { Copy, Menu, X, Maximize2 } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEffect, useRef, useState } from 'react'
import { WebviewTag } from 'electron'

interface XFrameProps {
  id: string
  session: string
  url: string
  onClose: (id: string) => void
  onDuplicate: (id: string) => void
  onNavigate: (id: string, url: string) => void
}

export function XFrame({
  id,
  session,
  url,
  onClose,
  onDuplicate,
  onNavigate
}: XFrameProps): JSX.Element {
  const webViewRef = useRef<WebviewTag>(null)
  const [internalUrl] = useState(url)
  const [maximized, setMaximized] = useState(false)
  const { listeners, setNodeRef, transform, transition } = useSortable({ id: id })

  useEffect(() => {
    if (!webViewRef.current) return
    webViewRef.current.addEventListener('did-navigate-in-page', (event) => {
      onNavigate(id, event.url)
    })
  }, [])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  function handleClose(): void {
    onClose(id)
  }

  function handleDuplicate(): void {
    onDuplicate(id)
  }

  function handleMaximize(): void {
    setMaximized(!maximized)
  }

  return (
    <div
      className={[
        `w-[${maximized ? '68' : '36'}rem]`,
        'h-full',
        'rounded-2xl',
        'min-w-96',
        'overflow-hidden',
        'border-4',
        'border-light-black',
        'hover:border-extra-light-black'
      ].join(' ')}
      style={style}
    >
      <div className="bg-light-black w-full hover:bg-extra-light-black h-8 px-3 flex justify-between items-center text-2xl text-dark-gray">
        <div ref={setNodeRef}>
          <Menu {...listeners} className="hover:text-light-gray" />
        </div>
        <div className="flex gap-3">
          <Maximize2 onClick={handleMaximize} />
          <Copy className="hover:text-light-gray" onClick={handleDuplicate} />
          <X onClick={handleClose} className="hover:text-light-gray" />
        </div>
      </div>

      <webview
        src={internalUrl}
        // eslint-disable-next-line react/no-unknown-property
        partition={'persist:' + session}
        className="h-full rounded-2xl"
        ref={webViewRef}
      />
    </div>
  )
}
