import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { setUser } = useAuth()

    function handleChange(e) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        try {
            await axiosInstance.post('/customers/login', form)
            const res = await axiosInstance.get('/customers/me')
            setUser(res.data)
            navigate('/home')
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid Credentials')
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
            <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
            <button type="submit">Login</button>
        </form>
    )
}