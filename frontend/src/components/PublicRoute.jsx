import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PublicRoute({ children }) {
    const { user, loading } = useAuth()

    if (loading) return <p>Loading...</p>
    if (user) return <Navigate to="/home" />
    if (user) return <Navigate to="/home" replace />
    return children
}