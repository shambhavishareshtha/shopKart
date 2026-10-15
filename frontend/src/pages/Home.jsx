import { useNavigate } from 'react-router-dom'
import axiosInstance from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Home() {
    const { user, setUser } = useAuth()
    const navigate = useNavigate()

    async function handleLogout() {
        await axiosInstance.post('/customers/logout')
        setUser(null)
        navigate('/login')
    }

    return (
        <div>
            <h2>Welcome, {user.fullName}</h2>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}