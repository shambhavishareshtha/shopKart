const express = require('express')
const router = express.Router()
const {
    addToCart,
    getCart,
    updateCart,
    removeFromCart
} = require('../controllers/cart.controller')
const isAuthenticated = require('../middlewares/auth.middleware')

router.post('/:productId', isAuthenticated, addToCart)
router.get('/', isAuthenticated, getCart)
router.patch('/:productId', isAuthenticated, updateCart)
router.delete('/:productId', isAuthenticated, removeFromCart)
module.exports = router