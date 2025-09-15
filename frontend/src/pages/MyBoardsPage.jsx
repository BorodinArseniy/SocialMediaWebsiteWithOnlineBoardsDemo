import React, { useEffect, useState } from 'react'
import axios from 'axios'
import BoardCard from '../components/BoardCard'
import AddBoardModal from '../components/AddBoardModal'


export default function MyBoardsPage(){
    const [boards, setBoards] = useState([])
    const [open, setOpen] = useState(false)
    useEffect(() => {
        axios.get('/api/users/me/boards').then(r => setBoards(r.data))
    }, [])
    return (
        <div className="ml-60 p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">My Boards</h1>
                <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={()=>setOpen(true)}>New Board</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {boards.map(b => <BoardCard key={b.id} board={b} />)}
            </div>
            <AddBoardModal open={open} onClose={()=>setOpen(false)} onCreated={b=>setBoards([b, ...boards])} />
        </div>
    )
}