import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function RegisterPage(){
    const { register } = useAuth()
    const nav = useNavigate()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const submit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const result = await register(username, email, password)

        if (result.success) {
            nav('/login')
        } else {
            setError(result.error)
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form className="bg-white p-6 rounded-lg shadow-md w-80" onSubmit={submit}>
                <h2 className="text-xl font-semibold mb-4">Create account</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <input
                    className="w-full border border-gray-300 p-3 mb-3 rounded focus:outline-none focus:border-blue-500"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    disabled={loading}
                    required
                />

                <input
                    className="w-full border border-gray-300 p-3 mb-3 rounded focus:outline-none focus:border-blue-500"
                    placeholder="Email (optional)"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={loading}
                />

                <input
                    className="w-full border border-gray-300 p-3 mb-4 rounded focus:outline-none focus:border-blue-500"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={loading}
                    required
                />

                <button
                    className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Creating account...' : 'Register'}
                </button>

                <div className="text-sm mt-4 text-center">
                    Have an account? <Link className="text-blue-600 hover:underline" to="/login">Sign in</Link>
                </div>
            </form>
        </div>
    )
}