
const express = require('express')
const router = express.Router()

const {
    createPaymentOrder,
    verifyPayment,
    getOrders,
    getOrderById
} = require('../controllers/order.controller')

const isAuthenticated = require('../middlewares/auth.middleware')

// Create a payment order
router.post('/create-payment-order', isAuthenticated, createPaymentOrder)

// Verify Razorpay payment
router.post('/verify-payment', isAuthenticated, verifyPayment)

// Get all orders of the logged-in customer
router.get('/', isAuthenticated, getOrders)

// Get one order by ID
router.get('/:id', isAuthenticated, getOrderById)

module.exports = router
