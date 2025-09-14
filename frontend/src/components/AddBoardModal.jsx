import React, { useState } from 'react'
import axios from 'axios'


export default function AddBoardModal({ open, onClose, onCreated }){
    const [title, setTitle] = useState('')
    const [isPublic, setIsPublic] = useState(true)
    if (!open) return null
    const create = async () => {
        const { data } = await axios.post('/api/boards', { title, isPrivate: !isPublic })
        onCreated(data); onClose()
    }
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-96">
                <h3 className="text-lg font-semibold mb-4">Create Board</h3>
                <input className="w-full border p-2 mb-3" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Board title" />
                <div className="mb-4 flex gap-4 text-sm">
                    <label><input type="radio" checked={isPublic} onChange={()=>setIsPublic(true)} /> Public</label>
                    <label><input type="radio" checked={!isPublic} onChange={()=>setIsPublic(false)} /> Private</label>
                </div>
                <div className="flex justify-end gap-2">
                    <button className="px-3 py-1" onClick={onClose}>Cancel</button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={create}>Create</button>
                </div>
            </div>
        </div>
    )
}