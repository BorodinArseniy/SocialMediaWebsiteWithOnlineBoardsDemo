import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthCtx = createContext()
export const useAuth = () => useContext(AuthCtx)

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token') || '')
    const [loading, setLoading] = useState(true)

    // Set axios header if token exists
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            // Validate token and get user info
            validateToken()
        } else {
            setLoading(false)
        }
    }, [token])

    const validateToken = async () => {
        try {
            const { data } = await axios.get('/api/auth/me')
            setUser(data)
        } catch (error) {
            console.error('Token validation failed:', error)
            // Token is invalid, clear it
            logout()
        } finally {
            setLoading(false)
        }
    }

    const login = async (username, password) => {
        try {
            const { data } = await axios.post('/api/auth/login', { username, password })
            setUser(data.user)
            setToken(data.token)
            localStorage.setItem('token', data.token)
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
            return { success: true }
        } catch (error) {
            console.error('Login failed:', error)
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            }
        }
    }

    const logout = () => {
        setUser(null)
        setToken('')
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
    }

    const register = async (username, email, password) => {
        try {
            await axios.post('/api/auth/register', { username, email, password })
            return { success: true }
        } catch (error) {
            console.error('Registration failed:', error)
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed'
            }
        }
    }

    return (
        <AuthCtx.Provider value={{ user, token, loading, login, logout, register }}>
            {children}
        </AuthCtx.Provider>
    )
}
