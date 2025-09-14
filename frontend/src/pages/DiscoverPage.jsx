import React, { useEffect, useState } from 'react'
import axios from 'axios'
import BoardCard from '../components/BoardCard'


export default function DiscoverPage(){
    const [boards, setBoards] = useState([])
    useEffect(()=>{ axios.get('/api/boards/discover').then(r=>setBoards(r.data)) }, [])
    return (
        <div className="ml-60 p-6">
            <h1 className="text-2xl font-bold mb-4">Discover</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {boards.map(b => <BoardCard key={b.id} board={b} />)}
            </div>
        </div>
    )
}