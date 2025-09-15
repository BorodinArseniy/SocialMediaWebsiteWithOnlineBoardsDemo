import React, { useEffect, useRef, useState } from 'react'
import { Excalidraw, exportToBlob, serializeAsJSON } from '@excalidraw/excalidraw'

export default function InfiniteBoard({ boardId }) {
    const excalidrawRef = useRef(null)
    const [excalidrawAPI, setExcalidrawAPI] = useState(null)
    const [viewModeEnabled, setViewModeEnabled] = useState(false)

    // Автосохранение каждые 5 секунд
    useEffect(() => {
        if (!excalidrawAPI) return

        const interval = setInterval(() => {
            const elements = excalidrawAPI.getSceneElements()
            const appState = excalidrawAPI.getAppState()

            // Сохраняем в localStorage (или отправляем на сервер)
            localStorage.setItem(`board-${boardId}`, serializeAsJSON(elements, appState))
        }, 5000)

        return () => clearInterval(interval)
    }, [excalidrawAPI, boardId])

    // Загружаем сохраненные данные
    useEffect(() => {
        const savedData = localStorage.getItem(`board-${boardId}`)
        if (savedData && excalidrawAPI) {
            try {
                const parsedData = JSON.parse(savedData)
                excalidrawAPI.updateScene(parsedData)
            } catch (error) {
                console.error('Ошибка загрузки данных:', error)
            }
        }
    }, [excalidrawAPI, boardId])

    const addTextElement = () => {
        if (!excalidrawAPI) return

        const { scrollX, scrollY } = excalidrawAPI.getAppState()
        const newElement = {
            type: 'text',
            id: `text-${Date.now()}`,
            x: (scrollX || 0) + 100,
            y: (scrollY || 0) + 100,
            width: 200,
            height: 50,
            text: 'Новый текст',
            fontSize: 16,
            fontFamily: 1,
            textAlign: 'left',
            verticalAlign: 'top',
            version: 1,
            versionNonce: Math.floor(Math.random() * 2 ** 31),
            isDeleted: false,
            angle: 0,
            seed: Math.floor(Math.random() * 2 ** 31),
            locked: false
        }

        excalidrawAPI.updateScene({
            elements: [...excalidrawAPI.getSceneElements(), newElement]
        })
    }

    const addStickyNote = () => {
        if (!excalidrawAPI) return

        const { scrollX, scrollY } = excalidrawAPI.getAppState()
        const rect = {
            type: 'rectangle',
            id: `sticky-${Date.now()}`,
            x: (scrollX || 0) + 50,
            y: (scrollY || 0) + 50,
            width: 200,
            height: 150,
            angle: 0,
            strokeColor: '#1e1e1e',
            backgroundColor: '#ffec99',
            fillStyle: 'solid',
            strokeWidth: 2,
            version: 1,
            versionNonce: Math.floor(Math.random() * 2 ** 31),
            isDeleted: false,
            seed: Math.floor(Math.random() * 2 ** 31),
            locked: false
        }

        const text = {
            type: 'text',
            id: `text-${Date.now()}`,
            x: rect.x + 10,
            y: rect.y + 10,
            width: 180,
            height: 130,
            text: 'Стикер',
            fontSize: 16,
            fontFamily: 1,
            textAlign: 'left',
            verticalAlign: 'top',
            containerId: rect.id,
            version: 1,
            versionNonce: Math.floor(Math.random() * 2 ** 31),
            isDeleted: false,
            angle: 0,
            seed: Math.floor(Math.random() * 2 ** 31),
            locked: false
        }

        excalidrawAPI.updateScene({
            elements: [...excalidrawAPI.getSceneElements(), rect, text]
        })
    }

    const exportToPNG = async () => {
        if (!excalidrawAPI) return

        const elements = excalidrawAPI.getSceneElements()
        const appState = excalidrawAPI.getAppState()
        const files = excalidrawAPI.getFiles()

        const blob = await exportToBlob({
            elements,
            appState,
            files,
            mimeType: 'image/png',
            quality: 0.8
        })

        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `board-${boardId}.png`
        link.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="h-screen w-full relative">
            <Excalidraw
                ref={excalidrawRef}
                initialData={{
                    elements: [],
                    appState: {
                        theme: 'light',
                        viewModeEnabled,
                        zenModeEnabled: false,
                        gridSize: null,
                        currentItemBackgroundColor: '#ffffff',
                        currentItemFillStyle: 'solid',
                        currentItemStrokeColor: '#1e1e1e',
                        currentItemStrokeStyle: 'solid',
                        currentItemStrokeWidth: 2,
                        scrollX: 0,
                        scrollY: 0,
                        zoom: { value: 1 }
                    },
                    scrollToContent: false
                }}
                onPointerUpdate={(payload) => {
                    // Отправляем курсор другим пользователям (для коллаборации)
                    console.log('Pointer update:', payload)
                }}
                onChange={(elements, appState, files) => {
                    // Можно отправлять изменения в реальном времени
                    console.log('Board changed')
                }}
                UIOptions={{
                    canvasActions: {
                        loadScene: false,
                        saveToActiveFile: false,
                        export: false,
                        toggleTheme: true,
                    }
                }}
            >
                <div className="excalidraw-toolbar">
                    <button
                        className="px-3 py-2 bg-blue-500 text-white rounded mr-2 hover:bg-blue-600"
                        onClick={addTextElement}
                    >
                        📝 Текст
                    </button>
                    <button
                        className="px-3 py-2 bg-yellow-500 text-white rounded mr-2 hover:bg-yellow-600"
                        onClick={addStickyNote}
                    >
                        📄 Стикер
                    </button>
                    <button
                        className="px-3 py-2 bg-green-500 text-white rounded mr-2 hover:bg-green-600"
                        onClick={exportToPNG}
                    >
                        💾 Экспорт PNG
                    </button>
                    <button
                        className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                        onClick={() => setViewModeEnabled(!viewModeEnabled)}
                    >
                        {viewModeEnabled ? '✏️ Режим редактирования' : '👁️ Режим просмотра'}
                    </button>
                </div>
            </Excalidraw>
        </div>
    )
}