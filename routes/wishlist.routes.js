const express = require('express')
const router = express.Router()

const {
    addToWishlist,
    getWishlist,
    removeFromWishlist
} = require('../controllers/wishlist.controller')

const isAuthenticated =
    require('../middlewares/auth.middleware')

router.post('/:productId', isAuthenticated, addToWishlist)
router.get('/', isAuthenticated, getWishlist)
router.delete('/:productId', isAuthenticated, removeFromWishlist)
module.exports = router