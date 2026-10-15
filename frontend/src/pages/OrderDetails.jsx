
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../services/api'

function OrderDetails() {
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
                    err.response?.data?.message ||
                    'Unable to load order details.'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchOrder()
    }, [id])

    if (loading) {
        return <p className="p-8 text-center">Loading order...</p>
    }

    if (error || !order) {
        return (
            <div className="p-8 text-center">
                <p className="mb-4 text-red-600">
                    {error || 'Order not found.'}
                </p>
                <Link to="/orders" className="text-green-700 underline">
                    Back to My Orders
                </Link>
            </div>
        )
    }

    const address = order.shippingAddress

    return (
        <div className="mx-auto max-w-4xl space-y-6 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-bold">Order Details</h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Order ID: {order._id}
                    </p>
                </div>

                <Link
                    to="/orders"
                    className="text-green-700 underline"
                >
                    Back to My Orders
                </Link>
            </div>

            <section className="rounded-xl border p-5">
                <h2 className="mb-4 text-xl font-semibold">
                    Order Status
                </h2>

                <p className="mb-2">
                    <strong>Payment:</strong> {order.paymentStatus}
                </p>
                <p className="mb-2">
                    <strong>Order:</strong> {order.status}
                </p>
                <p>
                    <strong>Placed on:</strong>{' '}
                    {new Date(order.createdAt).toLocaleString('en-IN')}
                </p>
            </section>

            <section className="rounded-xl border p-5">
                <h2 className="mb-4 text-xl font-semibold">
                    Items Ordered
                </h2>

                <div className="space-y-4">
                    {order.items.map((item, index) => (
                        <div
                            key={item.product || index}
                            className="flex items-center gap-4"
                        >
                            {item.image && (
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-20 w-20 rounded-lg object-cover"
                                />
                            )}

                            <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">
                                    ₹{Number(item.price).toFixed(2)} × {item.quantity}
                                </p>
                            </div>

                            <p className="font-semibold">
                                ₹{(
                                    item.price * item.quantity
                                ).toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-5 flex justify-between border-t pt-4 text-lg font-bold">
                    <span>Total</span>
                    <span>₹{Number(order.totalAmount).toFixed(2)}</span>
                </div>
            </section>

            <section className="rounded-xl border p-5">
                <h2 className="mb-4 text-xl font-semibold">
                    Shipping Address
                </h2>

                <p>{address?.fullName}</p>
                <p>{address?.phone}</p>
                <p>{address?.addressLine1}</p>
                <p>
                    {[address?.city, address?.state, address?.pincode]
                        .filter(Boolean)
                        .join(', ')}
                </p>
            </section>
        </div>
    )
}

export default OrderDetails
