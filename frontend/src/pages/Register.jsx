import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../services/api'

export default function Register() {
    const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '' })
    const [error, setError] = useState('')
    const navigate = useNavigate()

    function handleChange(e) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        try {
            await axiosInstance.post('/customers/register', form)
            navigate('/login')
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed')
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} />
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
            <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
            <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
            <button type="submit">Create Account</button>
        </form>
    )
}