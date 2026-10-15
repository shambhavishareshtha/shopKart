import { Link } from 'react-router-dom'
import api from '../services/api'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
const { addToCart } = useCart()
    const handleWishlist = async () => {
        try {
            await api.post(`/wishlist/${product._id}`)
            alert('Added to wishlist!')
        } catch (error) {
            console.error(error)
            alert('Could not add to wishlist')
        }
    }

    return (
        <div style={{ border: '1px solid #ccc', padding: '12px', width: '220px' }}>
            <img
                src={product.image}
                alt={product.name}
                style={{ width: '100%', height: '140px', objectFit: 'cover' }}
            />

            <h3>{product.name}</h3>
            <p>{product.category}</p>
            <p>₹{product.price}</p>
            <p>
                {product.stock > 0
                    ? `${product.stock} units left`
                    : 'Out of stock'}
            </p>

            <Link to={`/products/${product._id}`}>
                View Details
            </Link>

            <br />
            <button onClick={() => addToCart(product._id)}>
    Add to Cart
</button>
            <button onClick={handleWishlist}>
                Add to Wishlist
            </button>
        </div>
    )
}