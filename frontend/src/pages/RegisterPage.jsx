import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'


export default function RegisterPage(){
    const { register } = useAuth(); const nav = useNavigate()
    const [username, setU] = useState(''); const [email, setE] = useState(''); const [password, setP] = useState('')
    const submit = async (e) => { e.preventDefault(); await register(username, email, password); nav('/login') }
    return (
        <div className="min-h-screen flex items-center justify-center">
            <form className="bg-white p-6 rounded shadow w-80" onSubmit={submit}>
                <h2 className="text-xl font-semibold mb-4">Create account</h2>
                <input className="w-full border p-2 mb-3" placeholder="Username" value={username} onChange={e=>setU(e.target.value)} />
                <input className="w-full border p-2 mb-3" placeholder="Email (optional)" value={email} onChange={e=>setE(e.target.value)} />
                <input className="w-full border p-2 mb-3" type="password" placeholder="Password" value={password} onChange={e=>setP(e.target.value)} />
                <button className="w-full bg-blue-600 text-white py-2 rounded">Register</button>
                <div className="text-sm mt-3">Have an account? <Link className="text-blue-600" to="/login">Sign in</Link></div>
            </form>
        </div>
    )
}