import React, { useState } from 'react'

// Динамический импорт Excalidraw
const Excalidraw = React.lazy(() =>
    import('@excalidraw/excalidraw').then(module => ({
        default: module.Excalidraw
    }))
)

export default function InfiniteBoard({ boardId }) {
    const [isLoaded, setIsLoaded] = useState(false)

    return (
        <div className="h-screen w-full bg-gray-100">
            <React.Suspense fallback={
                <div className="h-screen w-full flex items-center justify-center">
                    <div className="text-xl">Загружаем интерактивную доску...</div>
                </div>
            }>
                <div className="h-full w-full">
                    <Excalidraw
                        initialData={{
                            elements: [],
                            appState: {
                                theme: "light",
                                viewModeEnabled: false
                            }
                        }}
                        onChange={() => {
                            if (!isLoaded) {
                                setIsLoaded(true)
                                console.log('Excalidraw загружен успешно!')
                            }
                        }}
                    />
                </div>
            </React.Suspense>

            {/* Простая панель инструментов */}
            {isLoaded && (
                <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg">
                    <div className="text-sm font-semibold">Доска #{boardId}</div>
                    <div className="text-xs text-gray-500 mt-1">
                        Используйте инструменты Excalidraw выше
                    </div>
                </div>
            )}
        </div>
    )
}