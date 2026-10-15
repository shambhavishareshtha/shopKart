
import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../services/api'

function OrderSuccess() {
    const { id } = useParams()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await api.get(`/orders/${id}`)
                setOrder(response.data.order)
            } catch (err) {
                setError(
                    err.response?.data?.message || 'Unable to load order details.'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchOrder()
    }, [id])

    if (loading) {
        return <p className="p-8 text-center">Loading order details...</p>
    }

    if (error || !order) {
        return (
            <div className="p-8 text-center">
                <p className="mb-4 text-red-600">
                    {error || 'Order not found.'}
                </p>
                <Link to="/orders" className="text-green-700 underline">
                    View My Orders
                </Link>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-2xl p-8 text-center">
            <div className="mb-4 text-5xl">✓</div>

            <h1 className="mb-3 text-3xl font-bold text-green-700">
                Order Confirmed!
            </h1>

            <p className="mb-6 text-gray-600">
                Your payment has been verified and your order has been placed.
            </p>

            <div className="rounded-xl border p-6 text-left">
                <p className="mb-2">
                    <strong>Order ID:</strong> {order._id}
                </p>

                <p className="mb-2">
                    <strong>Payment:</strong> {order.paymentStatus}
                </p>

                <p className="mb-2">
                    <strong>Order status:</strong> {order.status}
                </p>

                <p className="mb-4">
                    <strong>Total:</strong> ₹{order.totalAmount.toFixed(2)}
                </p>

                <h2 className="mb-3 font-semibold">Items</h2>

                {order.items.map((item, index) => (
                    <div key={item.product || index} className="mb-2">
                        {item.name} × {item.quantity} — ₹
                        {(item.price * item.quantity).toFixed(2)}
                    </div>
                ))}
            </div>

            <div className="mt-6 flex justify-center gap-4">
                <Link
                    to="/orders"
                    className="rounded-lg bg-green-700 px-5 py-3 text-white"
                >
                    My Orders
                </Link>

                <Link
                    to="/products"
                    className="rounded-lg border px-5 py-3"
                >
                    Continue Shopping
                </Link>
            </div>
        </div>
    )
}

export default OrderSuccess
