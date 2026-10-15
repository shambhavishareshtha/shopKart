
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import api from '../services/api'

const initialAddress = {
    fullName: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    pincode: ''
}

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true)
            return
        }

        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
    })
}

function Checkout() {
    const navigate = useNavigate()
    const { cart, fetchCart } = useCart()

    const [address, setAddress] = useState(initialAddress)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const totalAmount = cart.reduce((total, item) => {
        const product = item.product
        return total + (product?.price || 0) * item.quantity
    }, 0)

    const handleChange = (e) => {
        const { name, value } = e.target

        setAddress((previous) => ({
            ...previous,
            [name]: value
        }))
    }

    const validateAddress = () => {
        const allFieldsFilled = Object.values(address)
            .every((value) => value.trim() !== '')

        if (!allFieldsFilled) {
            return 'Please fill in all shipping details.'
        }

        if (!/^[6-9]\d{9}$/.test(address.phone.trim())) {
            return 'Enter a valid 10-digit Indian phone number.'
        }

        if (!/^\d{6}$/.test(address.pincode.trim())) {
            return 'Enter a valid 6-digit pincode.'
        }

        return ''
    }

    const handlePlaceOrder = async (e) => {
        e.preventDefault()
        setError('')

        const validationError = validateAddress()

        if (validationError) {
            setError(validationError)
            return
        }

        if (!cart.length) {
            setError('Your cart is empty.')
            return
        }

        setLoading(true)

        try {
            // Create the ShopKart order and Razorpay order
            const response = await api.post(
                '/orders/create-payment-order',
                { shippingAddress: address }
            )

            const paymentData = response.data

            // Load Razorpay Checkout
            const scriptLoaded = await loadRazorpayScript()

            if (!scriptLoaded) {
                setError('Unable to load Razorpay. Please try again.')
                return
            }

            const options = {
                key: paymentData.key,
                amount: paymentData.amount,
                currency: paymentData.currency,
                name: 'ShopKart',
                description: 'ShopKart purchase',
                order_id: paymentData.razorpayOrderId,

                handler: async (paymentResponse) => {
                    try {
                        setLoading(true)

                        // Verify payment on our backend
                        const verification = await api.post(
                            '/orders/verify-payment',
                            {
                                shopKartOrderId: paymentData.shopKartOrderId,
                                razorpay_order_id:
                                    paymentResponse.razorpay_order_id,
                                razorpay_payment_id:
                                    paymentResponse.razorpay_payment_id,
                                razorpay_signature:
                                    paymentResponse.razorpay_signature
                            }
                        )

                        if (!verification.data.success) {
                            throw new Error('Payment verification failed.')
                        }

                        // Refresh global cart state after verified payment
                        await fetchCart()

                        navigate(
                            `/order-success/${paymentData.shopKartOrderId}`
                        )
                    } catch (err) {
                        setError(
                            err.response?.data?.message ||
                            'Payment verification failed. Please contact support before retrying.'
                        )
                    } finally {
                        setLoading(false)
                    }
                },

                prefill: {
                    name: address.fullName,
                    contact: address.phone
                },

                notes: {
                    shopKartOrderId: paymentData.shopKartOrderId
                },

                theme: {
                    color: '#16a34a'
                },

                modal: {
                    ondismiss: () => {
                        setLoading(false)
                    }
                }
            }

            const paymentObject = new window.Razorpay(options)

            paymentObject.on('payment.failed', (event) => {
                setError(
                    event.error?.description ||
                    'Payment failed. Your cart has not been cleared.'
                )
                setLoading(false)
            })

            paymentObject.open()
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to start checkout. Please try again.'
            )
        } finally {
            setLoading(false)
        }
    }

    if (!cart.length) {
        return (
            <div className="mx-auto max-w-3xl p-8 text-center">
                <h1 className="mb-3 text-2xl font-bold">Your cart is empty</h1>
                <Link
                    to="/products"
                    className="text-green-700 underline"
                >
                    Continue shopping
                </Link>
            </div>
        )
    }

    return (
        <div className="mx-auto grid max-w-6xl gap-8 p-6 md:grid-cols-2">
            <section>
                <h1 className="mb-6 text-3xl font-bold">Checkout</h1>

                <form onSubmit={handlePlaceOrder} className="space-y-4">
                    <h2 className="text-xl font-semibold">
                        Shipping address
                    </h2>

                    {[
                        ['fullName', 'Full name'],
                        ['phone', '10-digit phone number'],
                        ['addressLine1', 'Address'],
                        ['city', 'City'],
                        ['state', 'State'],
                        ['pincode', '6-digit pincode']
                    ].map(([name, placeholder]) => (
                        <input
                            key={name}
                            name={name}
                            value={address[name]}
                            onChange={handleChange}
                            placeholder={placeholder}
                            required
                            className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-green-600"
                        />
                    ))}

                    {error && (
                        <p role="alert" className="text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? 'Processing...' : 'Pay with Razorpay'}
                    </button>

                    <Link
                        to="/cart"
                        className="block text-center text-sm text-gray-600 underline"
                    >
                        Back to cart
                    </Link>
                </form>
            </section>

            <section className="h-fit rounded-xl border border-gray-200 p-6">
                <h2 className="mb-5 text-xl font-semibold">
                    Order summary
                </h2>

                <div className="space-y-4">
                    {cart.map((item) => (
                        <div
                            key={item.product._id}
                            className="flex items-center gap-4"
                        >
                            <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="h-16 w-16 rounded-lg object-cover"
                            />

                            <div className="flex-1">
                                <p className="font-medium">
                                    {item.product.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Quantity: {item.quantity}
                                </p>
                            </div>

                            <p className="font-medium">
                                ₹{(
                                    item.product.price * item.quantity
                                ).toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex justify-between border-t pt-4 text-lg font-bold">
                    <span>Total</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                </div>

                <p className="mt-3 text-xs text-gray-500">
                    Final amount is calculated and validated by the server.
                </p>
            </section>
        </div>
    )
}

export default Checkout
