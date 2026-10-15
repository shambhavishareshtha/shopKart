const Customer = require('../models/customer.model')
const Product = require('../models/product.model')

async function addToWishlist(req, res) {
    try {
        const { productId } = req.params
        const customerId = req.user._id

        if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID'
            })
        }

        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }

        const customer = await Customer.findById(customerId)

        if (customer.wishlist.includes(productId)) {
            return res.status(409).json({
                success: false,
                message: 'Product already in wishlist'
            })
        }

        customer.wishlist.push(productId)
        await customer.save()

        res.status(200).json({
            success: true,
            message: 'Product added to wishlist'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
async function getWishlist(req, res) {
    try {
        const customerId = req.user._id

        const customer = await Customer.findById(customerId)
            .populate('wishlist')

        res.status(200).json({
            success: true,
            count: customer.wishlist.length,
            wishlist: customer.wishlist
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
async function removeFromWishlist(req, res) {
    try {
        const { productId } = req.params
        const customerId = req.user._id

        const customer = await Customer.findById(customerId)

        if (!customer.wishlist.includes(productId)) {
            return res.status(404).json({
                success: false,
                message: 'Product not in wishlist'
            })
        }

        customer.wishlist = customer.wishlist.filter(
            id => id.toString() !== productId
        )

        await customer.save()

        res.status(200).json({
            success: true,
            message: 'Product removed from wishlist'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
module.exports = {
    addToWishlist,
    getWishlist,
    removeFromWishlist
}