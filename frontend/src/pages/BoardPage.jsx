import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import InfiniteBoard from '../components/InfiniteBoard'

export default function BoardPage() {
    const { boardId } = useParams()
    const [board, setBoard] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchBoard()
    }, [boardId])

    const fetchBoard = async () => {
        try {
            const { data } = await axios.get(`/api/boards/${boardId}`)
            setBoard(data)
            setError(null)

            // Сохраняем данные доски в window для доступа из InfiniteBoard
            window.boardTitle = data.title
            window.boardIsPrivate = data.isPrivate
            window.boardOwner = data.owner?.username

        } catch (err) {
            console.error('Error loading board:', err)
            if (err.response?.status === 403) {
                setError('У вас нет доступа к этой доске')
            } else if (err.response?.status === 404) {
                setError('Доска не найдена')
            } else {
                setError('Ошибка загрузки доски')
            }
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f9fafb'
            }}>
                <div style={{ fontSize: '20px', color: '#6b7280' }}>
                    Загрузка доски...
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f9fafb'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        fontSize: '20px',
                        color: '#dc2626',
                        marginBottom: '16px'
                    }}>
                        {error}
                    </div>
                    <button
                        onClick={() => window.location.href = '/discover'}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}
                    >
                        Вернуться к доскам
                    </button>
                </div>
            </div>
        )
    }

    if (!board) return null

    // Рендерим InfiniteBoard на весь экран без сайдбара
    return <InfiniteBoard boardId={boardId} />
}