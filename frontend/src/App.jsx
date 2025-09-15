import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import AuthProvider, { useAuth } from './context/AuthContext'
import Sidebar from './components/Sidebar'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DiscoverPage from './pages/DiscoverPage'
import MyBoardsPage from './pages/MyBoardsPage'
import FollowingPage from './pages/FollowingPage'
import BoardPage from './pages/BoardPage'
import ProfilePage from './pages/ProfilePage'
import './excalidraw-overrides.css' // Импортируем стили для Excalidraw

function Shell(){
    const { token, loading } = useAuth()
    const location = useLocation()

    // Проверяем, находимся ли мы на странице доски
    const isBoardPage = location.pathname.startsWith('/board/')

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div>Loading...</div>
            </div>
        )
    }

    if (!token) {
        return (
            <Routes>
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/register" element={<RegisterPage/>} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        )
    }

    return (
        <>
            {/* Показываем Sidebar только если это не страница доски */}
            {!isBoardPage && <Sidebar/>}

            <div className={isBoardPage ? '' : 'ml-60'}>
                <Routes>
                    <Route path="/discover" element={<DiscoverPage/>} />
                    <Route path="/my" element={<MyBoardsPage/>} />
                    <Route path="/following" element={<FollowingPage/>} />
                    <Route path="/board/:boardId" element={<BoardPage/>} />
                    <Route path="/profile" element={<ProfilePage/>} />
                    <Route path="*" element={<Navigate to="/discover" />} />
                </Routes>
            </div>
        </>
    )
}

export default function App(){
    return (
        <AuthProvider>
            <Shell/>
        </AuthProvider>
    )
}