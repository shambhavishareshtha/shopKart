
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Cart() {
    const {
        cart,
        loading,
        updateCart,
        removeFromCart
    } = useCart()

    if (loading) {
        return <p className="p-6">Loading cart...</p>
    }

    if (cart.length === 0) {
        return (
            <div className="p-6 text-center">
                <h2 className="mb-4 text-2xl font-bold">
                    Your cart is empty.
                </h2>

                <Link
                    to="/products"
                    className="inline-block rounded-lg bg-green-700 px-6 py-3 text-white"
                >
                    Explore Products
                </Link>
            </div>
        )
    }

    const subtotal = cart.reduce(
        (total, item) =>
            total + item.product.price * item.quantity,
        0
    )

    return (
        <div className="mx-auto max-w-5xl p-6">
            <h1 className="mb-6 text-3xl font-bold">
                My Cart
            </h1>

            <div className="space-y-4">
                {cart.map((item) => (
                    <div
                        key={item.product._id}
                        className="flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4"
                    >
                        <div>
                            <h3 className="text-lg font-semibold">
                                {item.product.name}
                            </h3>

                            <p className="mt-1 text-gray-600">
                                ₹{Number(item.product.price).toFixed(2)}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    updateCart(
                                        item.product._id,
                                        item.quantity - 1
                                    )
                                }
                                disabled={item.quantity <= 1}
                                className="rounded border px-3 py-1 disabled:opacity-40"
                            >
                                −
                            </button>

                            <span>{item.quantity}</span>

                            <button
                                type="button"
                                onClick={() =>
                                    updateCart(
                                        item.product._id,
                                        item.quantity + 1
                                    )
                                }
                                disabled={
                                    item.quantity >= item.product.stock
                                }
                                className="rounded border px-3 py-1 disabled:opacity-40"
                            >
                                +
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    removeFromCart(item.product._id)
                                }
                                className="rounded-lg border border-red-300 px-3 py-2 text-red-600"
                            >
                                Remove
                            </button>
                        </div>

                        <p className="font-semibold">
                            ₹{(
                                item.product.price * item.quantity
                            ).toFixed(2)}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-8 ml-auto max-w-sm rounded-xl border p-5">
                <h2 className="mb-4 text-xl font-bold">
                    Order Summary
                </h2>

                <div className="mb-5 flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                        ₹{subtotal.toFixed(2)}
                    </span>
                </div>

                <Link
                    to="/checkout"
                    className="block w-full rounded-lg bg-green-700 px-6 py-3 text-center font-semibold text-white hover:bg-green-800"
                >
                    Checkout
                </Link>
            </div>
        </div>
    )
}

export default Cart
