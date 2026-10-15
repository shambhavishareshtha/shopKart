import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const CartContext = createContext()

export function CartProvider({ children }) {
    const [cart, setCart] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const fetchCart = async () => {
    try {
        setLoading(true)
        const response = await api.get('/cart')
        setCart(response.data.cart)
    } catch (error) {
        setError(error.message)
    } finally {
        setLoading(false)
    }
}
useEffect(() => {
    fetchCart()
}, [])
const addToCart = async (productId) => {
    try {
        setLoading(true)

        await api.post(`/cart/${productId}`)

        await fetchCart()

    } catch (error) {
        setError(error.message)
    } finally {
        setLoading(false)
    }
}
const updateCart = async (productId, quantity) => {
    try {
        console.log('Updating:', productId, quantity)

        setLoading(true)

        const response = await api.patch(`/cart/${productId}`, {
            quantity
        })

        console.log('Response:', response.data)
        await fetchCart()
    } catch (error) {
        console.log('Update error:', error.response?.data || error.message)
        setError(error.message)
    } finally {
        setLoading(false)
    }
}
const removeFromCart = async (productId) => {
    try {
        setLoading(true)

        await api.delete(`/cart/${productId}`)

        await fetchCart()
    } catch (error) {
        setError(error.message)
    } finally {
        setLoading(false)
    }
}
    return (
        <CartContext.Provider
            value={{
                cart,
                setCart,
                loading,
                setLoading,
                error,
                setError,
                fetchCart,
                addToCart,
                updateCart,
                    removeFromCart

            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    return useContext(CartContext)
}