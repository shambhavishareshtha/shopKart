import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../services/api'

export default function ProductDetails() {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        fetchProduct()
    }, [id])

    async function fetchProduct() {
        setLoading(true)
        setError(false)
        try {
            const res = await axiosInstance.get(`/products/${id}`)
            setProduct(res.data.product)
        } catch (err) {
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <p>Loading...</p>
    if (error || !product) return <p>Something went wrong while loading this product.</p>

    return (
        <div>
            <img src={product.image} alt={product.name} style={{ width: '300px' }} />
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>₹{product.price}</p>
            <p>{product.category}</p>
            <p>{product.stock > 0 ? `${product.stock} units left` : 'Out of stock'}</p>
            <button>Add to Cart</button>
        </div>
    )
}