import { useState, useEffect } from 'react'
import axiosInstance from '../services/api'
import ProductCard from '../components/ProductCard'

export default function Products() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('')

    useEffect(() => {
        fetchProducts()
    }, [search, category])

    async function fetchProducts() {
        setLoading(true)
        setError(false)
        try {
            const res = await axiosInstance.get('/products', {
                params: { search, category }
            })
            setProducts(res.data.products)
        } catch (err) {
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h2>Products</h2>

            <input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Books">Books</option>
                <option value="Home">Home</option>
            </select>

            {loading && <p>Loading products...</p>}
            {error && <p>Something went wrong while loading products.</p>}
            {!loading && !error && products.length === 0 && <p>No products found.</p>}

            {!loading && !error && products.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                    {products.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </div>
    )
}