import React, { createContext, useContext, useState } from 'react'
import axios from 'axios'


const AuthCtx = createContext()
export const useAuth = () => useContext(AuthCtx)


export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token') || '')


    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`


    const login = async (username, password) => {
        const { data } = await axios.post('/api/auth/login', { username, password })
        setUser(data.user); setToken(data.token)
        localStorage.setItem('token', data.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    }


    const logout = () => { setUser(null); setToken(''); localStorage.removeItem('token'); delete axios.defaults.headers.common['Authorization'] }


    const register = async (username, email, password) => {
        await axios.post('/api/auth/register', { username, email, password })
    }


    return <AuthCtx.Provider value={{ user, token, login, logout, register }}>{children}</AuthCtx.Provider>
}