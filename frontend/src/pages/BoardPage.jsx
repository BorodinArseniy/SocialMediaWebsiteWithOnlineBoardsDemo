import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import ContentBlock from '../components/ContentBlock'
import AddItemModal from '../components/AddItemModal'


export default function BoardPage(){
    const { boardId } = useParams()
    const [board, setBoard] = useState(null)
    const [open, setOpen] = useState(false)
    useEffect(()=>{ axios.get(`/api/boards/${boardId}`).then(r=>setBoard(r.data)) }, [boardId])
    if (!board) return <div className="ml-60 p-6">Loading...</div>
    return (
        <div className="ml-60 p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="text-sm text-gray-500">{board.isPrivate ? 'Private' : 'Public'}</div>
                    <h1 className="text-2xl font-bold">{board.title}</h1>
                </div>
                <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={()=>setOpen(true)}>Add Item</button>
            </div>
            <div className="space-y-3">
                {board.items?.map(it => <ContentBlock key={it.id} item={it} />)}
            </div>
            <AddItemModal open={open} onClose={()=>setOpen(false)} boardId={board.id} onCreated={it=>setBoard({...board, items:[it, ...(board.items||[])]})} />
        </div>
    )
}