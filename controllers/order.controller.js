
const mongoose = require('mongoose')
const crypto = require('crypto')

const Customer = require('../models/customer.model')
const Product = require('../models/product.model')
const Order = require('../models/order.model')
const razorpay = require('../config/razorpay')

// Create a ShopKart order and a Razorpay payment order
const createPaymentOrder = async (req, res) => {
    try {
        const {
            fullName,
            phone,
            addressLine1,
            city,
            state,
            pincode
        } = req.body.shippingAddress || {}

        // Validate shipping details
        if (
            !fullName?.trim() ||
            !phone?.trim() ||
            !addressLine1?.trim() ||
            !city?.trim() ||
            !state?.trim() ||
            !pincode?.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all shipping details'
            })
        }

        if (!/^[6-9]\d{9}$/.test(phone.trim())) {
            return res.status(400).json({
                success: false,
                message: 'Enter a valid 10-digit Indian phone number'
            })
        }

        if (!/^\d{6}$/.test(pincode.trim())) {
            return res.status(400).json({
                success: false,
                message: 'Enter a valid 6-digit pincode'
            })
        }

        // Load the authenticated customer's cart
        const customer = await Customer.findById(req.user._id)
            .populate('cart.product')

        if (!customer || !customer.cart.length) {
            return res.status(400).json({
                success: false,
                message: 'Your cart is empty'
            })
        }

        const items = []
        let totalAmount = 0

        // Use current database prices and stock, not frontend values
        for (const cartItem of customer.cart) {
            const product = await Product.findById(cartItem.product?._id)

            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: 'A product in your cart no longer exists'
                })
            }

            if (
                !Number.isInteger(cartItem.quantity) ||
                cartItem.quantity < 1 ||
                product.stock < cartItem.quantity
            ) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}`
                })
            }

            items.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: cartItem.quantity,
                image: product.image
            })

            totalAmount += product.price * cartItem.quantity
        }

        totalAmount = Number(totalAmount.toFixed(2))

        // Create our own pending ShopKart order
        const order = await Order.create({
            user: customer._id,
            items,
            shippingAddress: {
                fullName: fullName.trim(),
                phone: phone.trim(),
                addressLine1: addressLine1.trim(),
                city: city.trim(),
                state: state.trim(),
                pincode: pincode.trim()
            },
            totalAmount,
            paymentStatus: 'PENDING',
            status: 'PENDING_PAYMENT'
        })

        try {
            // Razorpay expects the amount in paise
            const razorpayOrder = await razorpay.orders.create({
                amount: Math.round(totalAmount * 100),
                currency: 'INR',
                receipt: order._id.toString()
            })

            order.razorpayOrderId = razorpayOrder.id
            await order.save()

            return res.status(201).json({
                success: true,
                message: 'Payment order created',
                shopKartOrderId: order._id,
                razorpayOrderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                key: process.env.RAZORPAY_KEY_ID
            })
        } catch (error) {
            order.paymentStatus = 'FAILED'
            await order.save()
            throw error
        }
    } catch (error) {
        console.error('Create payment order error:', error)
        return res.status(500).json({
            success: false,
            message: 'Unable to create payment order'
        })
    }
}


// Verify Razorpay's payment signature
const verifyPayment = async (req, res) => {
    try {
        const {
            shopKartOrderId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body

        if (
            !mongoose.isValidObjectId(shopKartOrderId) ||
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: 'Missing or invalid payment details'
            })
        }

        // Only the owner can verify their order
        const order = await Order.findOne({
            _id: shopKartOrderId,
            user: req.user._id
        })

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            })
        }

        if (order.paymentStatus === 'PAID') {
            return res.status(200).json({
                success: true,
                message: 'Payment already verified',
                order
            })
        }

        // Compare against the Razorpay order ID stored by our backend
        if (order.razorpayOrderId !== razorpay_order_id) {
            return res.status(400).json({
                success: false,
                message: 'Razorpay order ID mismatch'
            })
        }

        const signaturePayload =
            `${order.razorpayOrderId}|${razorpay_payment_id}`

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(signaturePayload)
            .digest('hex')

        const expectedBuffer = Buffer.from(expectedSignature, 'hex')
        const receivedBuffer = Buffer.from(razorpay_signature, 'hex')

        if (
            expectedBuffer.length !== receivedBuffer.length ||
            !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
        ) {
            return res.status(400).json({
                success: false,
                message: 'Payment signature verification failed'
            })
        }

        // Mark paid only after the signature is verified
        order.razorpayPaymentId = razorpay_payment_id
        order.paymentStatus = 'PAID'
        order.status = 'PLACED'
        await order.save()

        // Clear the cart only after verified payment
        const customer = await Customer.findById(req.user._id)

        if (customer) {
            customer.cart = []
            await customer.save()
        }

        return res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            order
        })
    } catch (error) {
        console.error('Verify payment error:', error)
        return res.status(500).json({
            success: false,
            message: 'Unable to verify payment'
        })
    }
}


// Get all orders belonging to the logged-in customer
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user._id
        }).sort({ createdAt: -1 })

        return res.status(200).json({
            success: true,
            orders
        })
    } catch (error) {
        console.error('Get orders error:', error)
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch orders'
        })
    }
}


// Get one order, only if it belongs to the logged-in customer
const getOrderById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid order ID'
            })
        }

        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id
        })

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            })
        }

        return res.status(200).json({
            success: true,
            order
        })
    } catch (error) {
        console.error('Get order error:', error)
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch order'
        })
    }
}

module.exports = {
    createPaymentOrder,
    verifyPayment,
    getOrders,
    getOrderById
}
