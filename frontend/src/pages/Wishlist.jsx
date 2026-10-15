import { useEffect, useState } from 'react'
import api from '../services/api'
import WishlistCard from '../components/WishlistCard'

function Wishlist() {
    const [wishlist, setWishlist] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchWishlist()
    }, [])

    const fetchWishlist = async () => {
        try {
            const response = await api.get('/wishlist')
            setWishlist(response.data.wishlist)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleRemove = async (productId) => {
        try {
            await api.delete(`/wishlist/${productId}`)
            fetchWishlist()
        } catch (error) {
            console.error(error)
        }
    }

    if (loading) {
        return <p>Loading wishlist...</p>
    }

    return (
        <div>
            <h1>My Wishlist</h1>

            {wishlist.length === 0 ? (
                <p>Your wishlist is empty.</p>
            ) : (
                wishlist.map(product => (
                    <WishlistCard
                        key={product._id}
                        product={product}
                        onRemove={handleRemove}
                    />
                ))
            )}
        </div>
    )
}

export default Wishlist