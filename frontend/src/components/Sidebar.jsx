import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'


export default function Sidebar(){
    const { user, logout } = useAuth()
    return (
        <aside className="fixed left-0 top-0 h-screen w-60 bg-white shadow-md p-4">
            <div className="text-2xl font-bold mb-8">BoardSpace</div>
            <nav className="space-y-2">
                <NavLink className="block px-3 py-2 rounded hover:bg-gray-100" to="/discover">Discover</NavLink>
                <NavLink className="block px-3 py-2 rounded hover:bg-gray-100" to="/my">My Boards</NavLink>
                <NavLink className="block px-3 py-2 rounded hover:bg-gray-100" to="/following">Following</NavLink>
                <NavLink className="block px-3 py-2 rounded hover:bg-gray-100" to="/profile">Profile</NavLink>
            </nav>
            <div className="absolute bottom-4 left-4 right-4 text-sm">
                {user ? (
                    <div className="flex items-center justify-between">
                        <span>@{user.username}</span>
                        <button className="text-red-600" onClick={logout}>Logout</button>
                    </div>
                ) : <span className="text-gray-400">Not signed in</span>}
            </div>
        </aside>
    )
}