import React from 'react'
import { useAuth } from '../context/AuthContext'


export default function ProfilePage(){
    const { user } = useAuth()
    return (
        <div className="ml-60 p-6">
            <h1 className="text-2xl font-bold mb-2">Profile</h1>
            {user ? (
                <div className="bg-white rounded shadow p-4">
                    <div><span className="font-semibold">Username:</span> {user.username}</div>
                    <div><span className="font-semibold">Email:</span> {user.email||'—'}</div>
                </div>
            ) : <p>Please sign in.</p>}
        </div>
    )
}