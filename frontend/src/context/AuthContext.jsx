import { createContext, useContext, useState, useEffect } from 'react'
import axiosInstance from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {// runs only once when the app loads and calls /me from backend
        axiosInstance.get('/customers/me')
            .then(res => setUser(res.data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false))
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>// makes all this availabe to every component in ur app
    )
}

export function useAuth() {
    return useContext(AuthContext) // function to collect data quickly
}