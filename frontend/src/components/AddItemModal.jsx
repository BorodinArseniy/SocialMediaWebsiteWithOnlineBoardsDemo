import React, { useState } from 'react'
import axios from 'axios'


export default function AddItemModal({ open, onClose, boardId, onCreated }){
    const [type, setType] = useState('TEXT')
    const [text, setText] = useState('')
    const [url, setUrl] = useState('')
    if (!open) return null
    const create = async () => {
        const { data } = await axios.post(`/api/boards/${boardId}/items`, { type, textContent: text, urlContent: url })
        onCreated(data); onClose()
    }
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-96">
                <h3 className="text-lg font-semibold mb-4">Add New Item</h3>
                <select className="w-full border p-2 mb-3" value={type} onChange={e=>setType(e.target.value)}>
                    <option>TEXT</option><option>IMAGE</option><option>LINK</option>
                    <option>QUOTE</option><option>GOAL</option><option>VIDEO</option><option>MUSIC</option>
                </select>
                {(type==='TEXT'||type==='QUOTE'||type==='GOAL') && (
                    <textarea className="w-full border p-2 mb-3" rows={4} placeholder="Text..." value={text} onChange={e=>setText(e.target.value)} />
                )}
                {(type==='IMAGE'||type==='LINK'||type==='VIDEO'||type==='MUSIC') && (
                    <input className="w-full border p-2 mb-3" placeholder="URL..." value={url} onChange={e=>setUrl(e.target.value)} />
                )}
                <div className="flex justify-end gap-2">
                    <button className="px-3 py-1" onClick={onClose}>Cancel</button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={create}>Add Item</button>
                </div>
            </div>
        </div>
    )
}