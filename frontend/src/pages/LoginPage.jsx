import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'


export default function LoginPage(){
    const { login } = useAuth(); const nav = useNavigate()
    const [username, setU] = useState(''); const [password, setP] = useState('')
    const submit = async (e) => { e.preventDefault(); await login(username, password); nav('/discover') }
    return (
        <div className="min-h-screen flex items-center justify-center">
            <form className="bg-white p-6 rounded shadow w-80" onSubmit={submit}>
                <h2 className="text-xl font-semibold mb-4">Sign in</h2>
                <input className="w-full border p-2 mb-3" placeholder="Username" value={username} onChange={e=>setU(e.target.value)} />
                <input className="w-full border p-2 mb-3" type="password" placeholder="Password" value={password} onChange={e=>setP(e.target.value)} />
                <button className="w-full bg-blue-600 text-white py-2 rounded">Sign in</button>
                <div className="text-sm mt-3">No account? <Link className="text-blue-600" to="/register">Register</Link></div>
            </form>
        </div>
    )
}