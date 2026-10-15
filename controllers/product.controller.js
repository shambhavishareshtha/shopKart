const Product = require('../models/product.model')

async function createProduct(req, res) {
    try {
        const { name, description, price, category, image, stock } = req.body

        if (!name || !description || !category || !image) {
            return res.status(400).json({ success: false, message: 'All fields are required' })
        }
        if (price === undefined || price <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid price' })
        }
        if (stock === undefined || stock < 0) {
            return res.status(400).json({ success: false, message: 'Invalid stock' })
        }

        const product = await Product.create({ name, description, price, category, image, stock })

        res.status(201).json({ success: true, product })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}
async function getAllProducts(req, res) {
    try {
        const { search, category } = req.query
        const filter = {}

        if (search) {
            filter.name = { $regex: search, $options: 'i' }
        }
        if (category) {
            filter.category = category
        }

        const products = await Product.find(filter)
        res.status(200).json({ success: true, count: products.length, products })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}
async function getProductById(req, res) {
    try {
        const { id } = req.params

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: 'Invalid product ID' })
        }

        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' })
        }

        res.status(200).json({ success: true, product })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

module.exports = { createProduct, getAllProducts, getProductById }