import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import InfiniteBoard from '../components/InfiniteBoard' // Новый компонент
// Удаляем старые импорты:
// import ContentBlock from '../components/ContentBlock'
// import AddItemModal from '../components/AddItemModal'

export default function BoardPage(){
    const { boardId } = useParams()
    const [board, setBoard] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBoard = async () => {
            try {
                const response = await axios.get(`/api/boards/${boardId}`)
                setBoard(response.data)
            } catch (error) {
                console.error('Ошибка загрузки доски:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchBoard()
    }, [boardId])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-xl">Загрузка доски...</div>
            </div>
        )
    }

    if (!board) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-xl text-red-600">Доска не найдена</div>
            </div>
        )
    }

    return (
        <div className="h-screen w-full">
            {/* Заголовок доски */}
            <div className="absolute top-4 right-4 z-10 bg-white p-3 rounded-lg shadow-lg">
                <div className="text-sm text-gray-500">
                    {board.isPrivate ? '🔒 Приватная' : '🌐 Публичная'}
                </div>
                <h1 className="text-lg font-bold">{board.title}</h1>
                <div className="text-sm text-gray-600">
                    by {board.owner?.username || 'неизвестно'}
                </div>
            </div>

            {/* Бесконечная доска */}
            <InfiniteBoard boardId={boardId} />
        </div>
    )
}
