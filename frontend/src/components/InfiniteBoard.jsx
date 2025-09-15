// frontend/src/components/InfiniteBoard.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react'
import axios from 'axios'

// Ленивая загрузка Excalidraw
const Excalidraw = React.lazy(() =>
    import('@excalidraw/excalidraw').then(module => ({
        default: module.Excalidraw
    }))
)

export default function InfiniteBoard({ boardId }) {
    const [excalidrawAPI, setExcalidrawAPI] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [lastSaved, setLastSaved] = useState(null)
    const saveTimeoutRef = useRef(null)

    // Загрузка данных доски при монтировании
    useEffect(() => {
        if (excalidrawAPI) {
            loadBoardData()
        }
    }, [excalidrawAPI, boardId])

    // Автосохранение с debounce
    const debouncedSave = useCallback(() => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current)
        }

        saveTimeoutRef.current = setTimeout(() => {
            saveBoardData()
        }, 5000) // Сохраняем через 5 секунд после последнего изменения
    }, [])

    const loadBoardData = async () => {
        try {
            const { data } = await axios.get(`/api/boards/${boardId}/canvas`)

            if (data && data.elements && data.elements.length > 0) {
                excalidrawAPI.updateScene({
                    elements: data.elements,
                    appState: {
                        ...data.appState,
                        collaborators: new Map() // Очищаем коллабораторов при загрузке
                    }
                })
            }
        } catch (error) {
            console.log('No saved canvas data or error loading:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const saveBoardData = useCallback(async () => {
        if (!excalidrawAPI || isSaving) return

        setIsSaving(true)
        try {
            const elements = excalidrawAPI.getSceneElements()
            const appState = excalidrawAPI.getAppState()

            // Сохраняем только нужные данные appState
            const canvasData = {
                elements,
                appState: {
                    viewBackgroundColor: appState.viewBackgroundColor,
                    currentItemFontFamily: appState.currentItemFontFamily,
                    gridSize: appState.gridSize
                }
            }

            await axios.put(`/api/boards/${boardId}/canvas`, canvasData)
            setLastSaved(new Date())
        } catch (error) {
            console.error('Error saving canvas:', error)
        } finally {
            setIsSaving(false)
        }
    }, [excalidrawAPI, boardId, isSaving])

    const exportImage = async () => {
        if (!excalidrawAPI) return

        try {
            const blob = await import('@excalidraw/excalidraw').then(module =>
                module.exportToBlob({
                    elements: excalidrawAPI.getSceneElements(),
                    appState: excalidrawAPI.getAppState(),
                    files: excalidrawAPI.getFiles(),
                    mimeType: 'image/png',
                })
            )

            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `board-${boardId}-${Date.now()}.png`
            link.click()
            URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Export error:', error)
        }
    }

    const resetView = () => {
        if (!excalidrawAPI) return
        excalidrawAPI.scrollToContent()
    }

    return (
        <div style={{ height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0 }}>
            {/* Панель инструментов */}
            <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                zIndex: 10,
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                minWidth: '200px'
            }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Инструменты
                </div>

                <button
                    onClick={() => saveBoardData()}
                    disabled={isSaving}
                    style={{
                        padding: '8px 12px',
                        backgroundColor: isSaving ? '#94a3b8' : '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        cursor: isSaving ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => !isSaving && (e.target.style.backgroundColor = '#2563eb')}
                    onMouseLeave={(e) => !isSaving && (e.target.style.backgroundColor = '#3b82f6')}
                >
                    {isSaving ? 'Сохранение...' : 'Сохранить'}
                </button>

                <button
                    onClick={exportImage}
                    style={{
                        padding: '8px 12px',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
                >
                    Экспорт PNG
                </button>

                <button
                    onClick={resetView}
                    style={{
                        padding: '8px 12px',
                        backgroundColor: '#6b7280',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#4b5563'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#6b7280'}
                >
                    Сбросить вид
                </button>

                {lastSaved && (
                    <div style={{
                        fontSize: '11px',
                        color: '#6b7280',
                        marginTop: '4px',
                        textAlign: 'center'
                    }}>
                        Сохранено: {lastSaved.toLocaleTimeString()}
                    </div>
                )}
            </div>

            {/* Информация о доске - перенесена из BoardPage */}
            <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                zIndex: 10,
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                padding: '16px',
                maxWidth: '300px'
            }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    {window.boardTitle || 'new'}
                </div>
                <div style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    backgroundColor: window.boardIsPrivate ? '#fee2e2' : '#dcfce7',
                    color: window.boardIsPrivate ? '#dc2626' : '#16a34a'
                }}>
                    {window.boardIsPrivate ? '🔒 Приватная' : '🌐 Публичная'}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>
                    Автор: @{window.boardOwner || 'admin'}
                </div>
                <button
                    onClick={() => window.location.href = '/my'}
                    style={{
                        width: '100%',
                        marginTop: '12px',
                        padding: '8px',
                        backgroundColor: '#f3f4f6',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                >
                    ← К моим доскам
                </button>
            </div>

            {/* Подсказки по навигации */}
            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                zIndex: 10,
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                padding: '12px',
                maxWidth: '280px'
            }}>
                <div style={{ fontSize: '12px', color: '#374151' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Навигация:</div>
                    <div>• Зажмите пробел + мышь для перемещения</div>
                    <div>• Ctrl/Cmd + колесо для зума</div>
                    <div>• Или используйте инструмент "рука" (H)</div>
                </div>
            </div>

            {/* Excalidraw контейнер */}
            <React.Suspense fallback={
                <div style={{
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    color: '#6b7280'
                }}>
                    Загрузка интерактивной доски...
                </div>
            }>
                <Excalidraw
                    excalidrawAPI={(api) => setExcalidrawAPI(api)}
                    initialData={{
                        elements: [],
                        appState: {
                            viewBackgroundColor: '#ffffff',
                            currentItemFontFamily: 1,
                            gridSize: null,
                            theme: 'light'
                        },
                        scrollToContent: true
                    }}
                    onChange={(elements, appState) => {
                        if (!isLoading) {
                            debouncedSave()
                        }
                    }}
                    langCode="ru-RU"
                    renderTopRightUI={() => null}
                    UIOptions={{
                        canvasActions: {
                            changeViewBackgroundColor: true,
                            clearCanvas: true,
                            export: false,
                            loadScene: false,
                            saveToActiveFile: false,
                            theme: true,
                            saveAsImage: false
                        }
                    }}
                />
            </React.Suspense>
        </div>
    )
}