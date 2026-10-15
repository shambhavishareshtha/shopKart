import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Navbar() {
    const { cart } = useCart()

    const cartCount = cart.reduce(
        (total, item) => total + item.quantity,
        0
    )

    return (
        <nav>
            <Link to="/home">Home</Link>{' | '}
            <Link to="/products">Products</Link>{' | '}
            <Link to="/wishlist">Wishlist</Link>{' | '}
            <Link to="/cart">Cart ({cartCount})</Link>
        </nav>
    )
}