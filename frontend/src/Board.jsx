import React, { useEffect, useRef, useState } from 'react'
import { Excalidraw, exportToBlob } from '@excalidraw/excalidraw'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence } from 'y-indexeddb'

export default function Board({ boardId }) {
    const excalRef = useRef(null)
    const [doc] = useState(() => new Y.Doc())
    const [files, setFiles] = useState({})

    useEffect(() => {
        const idb = new IndexeddbPersistence(`board-${boardId}`, doc)
        const wsUrl = (import.meta.env.VITE_YWS_URL || 'ws://localhost:1234')
        const provider = new WebsocketProvider(wsUrl, `board-${boardId}`, doc, { connect: true })

        return () => {
            provider.destroy()
            idb.destroy()
            doc.destroy()
        }
    }, [boardId, doc])

    const saveSnapshot = async () => {
        const api = excalRef.current
        if (!api) return
        const elements = api.getSceneElementsIncludingDeleted()
        const appState = api.getAppState()
        const currentFiles = api.getFiles()

        const png = await exportToBlob({ elements, appState, files: currentFiles, mimeType: 'image/png', quality: 0.9 })
        const fd = new FormData()
        fd.append('preview', png, 'preview.png')
        fd.append('scene', JSON.stringify({ elements, appState }))
        await fetch(`/api/boards/${boardId}/snapshot`, { method: 'PUT', body: fd })
    }

    const onUploadMedia = async (file) => {
        const fd = new FormData()
        fd.append('file', file)
        const res = await fetch('/api/files', { method: 'POST', body: fd })
        const { url, mime } = await res.json()

        const api = excalRef.current
        if (!api) return
        const { scrollX, scrollY } = api.getAppState()

        if (mime.startsWith('image/')) {
            api.updateScene({
                elements: [
                    ...api.getSceneElements(),
                    {
                        type: 'image',
                        version: 1,
                        versionNonce: Math.floor(Math.random() * 2 ** 31),
                        isDeleted: false,
                        id: `img-${Date.now()}`,
                        x: (scrollX || 0) + 50,
                        y: (scrollY || 0) + 50,
                        width: 400,
                        height: 300,
                        angle: 0,
                        seed: Date.now(),
                        fileId: url,
                        locked: false
                    }
                ]
            })
        } else if (mime.startsWith('video/')) {
            api.updateScene({
                elements: [
                    ...api.getSceneElements(),
                    {
                        type: 'rectangle',
                        id: `video-${Date.now()}`,
                        x: (scrollX || 0) + 50,
                        y: (scrollY || 0) + 50,
                        width: 480,
                        height: 270,
                        angle: 0,
                        version: 1,
                        versionNonce: Math.floor(Math.random() * 2 ** 31),
                        isDeleted: false,
                        link: url,
                        locked: false
                    }
                ]
            })
            // Для реального видео сделайте overlay-компонент, который рендерит <video src={link} controls />
        }
    }

    return (
        <div style={{ height: '100vh' }}>
            <Excalidraw
                ref={excalRef}
                initialData={{ elements: [], appState: { theme: 'light' }, scrollToContent: true, files }}
                onChange={(elements, appState, nextFiles) => setFiles(nextFiles)}
                UIOptions={{ canvasActions: { saveToActiveFile: false } }}
            />
            <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 8 }}>
                <input type="file" accept="image/*,video/*"
                       onChange={(e) => e.target.files?.[0] && onUploadMedia(e.target.files[0])} />
                <button onClick={saveSnapshot}>Save snapshot</button>
            </div>
        </div>
    )
}
