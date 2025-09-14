import React from 'react'
import { Link } from 'react-router-dom'


export default function BoardCard({ board }){
    return (
        <div className="bg-white rounded shadow p-4">
            <div className="text-xs text-gray-500 mb-2">{board.isPrivate ? 'Private' : 'Public'}</div>
            <h3 className="font-semibold text-lg mb-2">{board.title}</h3>
            <div className="text-sm text-gray-600 mb-4">by {board.owner?.username || 'unknown'}</div>
            <Link className="px-3 py-1 bg-blue-600 text-white rounded" to={`/board/${board.id}`}>View</Link>
        </div>
    )
}