
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function Orders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders')
                setOrders(response.data.orders || [])
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    'Unable to load your orders.'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [])

    if (loading) {
        return (
            <p className="p-8 text-center">
                Loading your orders...
            </p>
        )
    }

    if (error) {
        return (
            <p role="alert" className="p-8 text-center text-red-600">
                {error}
            </p>
        )
    }

    return (
        <div className="mx-auto max-w-5xl p-6">
            <h1 className="mb-6 text-3xl font-bold">
                My Orders
            </h1>

            {orders.length === 0 ? (
                <div className="rounded-xl border p-8 text-center">
                    <p className="mb-4 text-gray-600">
                        You haven't placed any orders yet.
                    </p>

                    <Link
                        to="/products"
                        className="inline-block rounded-lg bg-green-700 px-5 py-3 text-white"
                    >
                        Explore Products
                    </Link>
                </div>
            ) : (
                <div className="space-y-5">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="rounded-xl border border-gray-200 p-5 shadow-sm"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <p className="font-semibold">
                                        Order #{order._id.slice(-8)}
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="font-bold">
                                        ₹{Number(
                                            order.totalAmount
                                        ).toFixed(2)}
                                    </p>

                                    <p className="mt-1 text-sm">
                                        Payment:{' '}
                                        <span className={
                                            order.paymentStatus === 'PAID'
                                                ? 'font-semibold text-green-700'
                                                : 'font-semibold text-orange-600'
                                        }>
                                            {order.paymentStatus}
                                        </span>
                                    </p>

                                    <p className="text-sm text-gray-600">
                                        Status: {order.status}
                                    </p>
                                </div>
                            </div>

                            <div className="my-4 border-t" />

                            <div className="space-y-3">
                                {order.items.map((item, index) => (
                                    <div
                                        key={item.product || index}
                                        className="flex items-center gap-3"
                                    >
                                        {item.image && (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-14 w-14 rounded-lg object-cover"
                                            />
                                        )}

                                        <div className="flex-1">
                                            <p className="font-medium">
                                                {item.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Quantity: {item.quantity}
                                            </p>
                                        </div>

                                        <p className="text-sm font-medium">
                                            ₹{(
                                                item.price * item.quantity
                                            ).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-5">
                                <Link
                                    to={`/orders/${order._id}`}
                                    className="text-sm font-semibold text-green-700 underline"
                                >
                                    View order details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Orders
