function WishlistCard({ product, onRemove }) {
    return (
        <div>
            <img src={product.image} alt={product.name} />
            <h2>{product.name}</h2>
            <p>₹{product.price}</p>

            <button onClick={() => onRemove(product._id)}>
                Remove
            </button>
        </div>
    )
}


export default WishlistCard