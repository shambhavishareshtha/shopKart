const bcrypt = require('bcrypt')
const Customer = require('../models/customer.model')
//1.register customer funtion
async function registerCustomer(req, res) {
    try {
        const { fullName, email, password, phone } = req.body

        if (!fullName || !email || !password || !phone) {// require:true
            return res.status(400).json({ success: false, message: 'All fields are required' })
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' })
        }

        const existingCustomer = await Customer.findOne({ email })//chevks without blocking the whole 
        if (existingCustomer) {
            return res.status(409).json({ success: false, message: 'Email already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newCustomer = await Customer.create({
            fullName,
            email,
            password: hashedPassword,
            phone
        })

        res.status(201).json({
            success: true,
            message: 'Customer registered successfully',
            customer: {
                _id: newCustomer._id,
                fullName: newCustomer.fullName,
                email: newCustomer.email,
                phone: newCustomer.phone
            }
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}
const generateToken = require('../utils/generateToken')
//login customer function
async function loginCustomer(req, res) {
    try {
        const { email, password } = req.body

        const customer = await Customer.findOne({ email })
        if (!customer) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' })
        }

        const isPasswordCorrect = await bcrypt.compare(password, customer.password)
        if (!isPasswordCorrect) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' })
        }

        const token = generateToken(customer._id)

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            success: true,
            message: 'Login successful'
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}



async function getProfile(req, res) {
    res.status(200).json({
        _id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
        phone: req.user.phone
    })
}

async function logoutCustomer(req, res) {
    res.clearCookie('token')// asks to delete the cookies -easiest way to logout someone
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    })
}



module.exports = { registerCustomer, loginCustomer, getProfile, logoutCustomer }