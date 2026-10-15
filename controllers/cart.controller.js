const Customer = require('../models/customer.model')
const Product = require('../models/product.model')

async function addToCart(req, res) {
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

const existingItem = customer.cart.find(
    item => item.product.toString() === productId
)
if (existingItem) {
    if (existingItem.quantity + 1 > product.stock) {
        return res.status(400).json({
            success: false,
            message: 'Not enough stock'
        })
    }

    existingItem.quantity += 1
} else {
    customer.cart.push({
        product: productId,
        quantity: 1
    })
}
await customer.save()

res.status(200).json({
    success: true,
    message: 'Product added to cart',
    cart: customer.cart
})

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
async function getCart(req, res) {
    try {
        const customerId = req.user._id

        const customer = await Customer.findById(customerId)
            .populate('cart.product')

        res.status(200).json({
            success: true,
            cart: customer.cart
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
async function updateCart(req, res) {
    try {
        const { productId } = req.params
        const { quantity } = req.body
        const customerId = req.user._id

        if (typeof quantity !== 'number' || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Invalid quantity'
            })
        }

        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: 'Not enough stock'
            })
        }

        const customer = await Customer.findById(customerId)

        const existingItem = customer.cart.find(
            item => item.product.toString() === productId
        )

        if (!existingItem) {
            return res.status(404).json({
                success: false,
                message: 'Product not in cart'
            })
        }

        existingItem.quantity = quantity

        await customer.save()

        res.status(200).json({
            success: true,
            message: 'Cart updated',
            cart: customer.cart
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
async function removeFromCart(req, res) {
    try {
        const { productId } = req.params
        const customerId = req.user._id

        const customer = await Customer.findById(customerId)

        const existingItem = customer.cart.find(
            item => item.product.toString() === productId
        )

        if (!existingItem) {
            return res.status(404).json({
                success: false,
                message: 'Product not in cart'
            })
        }

        customer.cart = customer.cart.filter(
            item => item.product.toString() !== productId
        )

        await customer.save()

        res.status(200).json({
            success: true,
            message: 'Product removed from cart',
            cart: customer.cart
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    addToCart,
    getCart,
    updateCart,
    removeFromCart
}