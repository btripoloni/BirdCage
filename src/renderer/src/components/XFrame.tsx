import { Copy, Menu, X } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEffect, useRef, useState } from 'react'

interface XFrameProps {
  id: string
  session: string
  url: string
  onClose: (id: string) => void
  onDuplicate: (id: string) => void
  onNavigate: (id: string, url: string) => void
}

interface WebViewDidNavigateInPageEvent extends Event {
  url: string
}

interface WebView extends HTMLWebViewElement {
  addEventListener: (
    event: string,
    listener: (event: WebViewDidNavigateInPageEvent) => void
  ) => void
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function XFrame({ id, session, url, onClose, onDuplicate, onNavigate }: XFrameProps) {
  const webViewRef = useRef<WebView>(null)
  const [internalUrl] = useState(url)

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

  return (
    <div
      className="w-[34rem] h-full rounded-2xl min-w-96 overflow-hidden border-4 border-light-black hover:border-extra-light-black"
      style={style}
    >
      <div className="bg-light-black w-full hover:bg-extra-light-black h-8 px-3 flex justify-between items-center text-2xl text-dark-gray">
        <div ref={setNodeRef}>
          <Menu {...listeners} className="hover:text-light-gray" />
        </div>
        <div className="flex gap-2">
          <Copy className="hover:text-light-gray" onClick={() => onDuplicate(id)} />
          <X onClick={() => onClose(id)} className="hover:text-light-gray" />
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
