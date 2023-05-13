const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchUser')

// Schemas
const User = require('../models/Users');

// For security
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = `my_IGN_is_It's_Handsome`;


// ROUTE 1: Create a User using: POST "/api/auth/signup".
router.post('/signup', async (req, res) => {

    let success = false;

    try {
        // Check weather a user with the same email exists or not?
        let newUser = await User.findOne({ email: req.body.values.email });
        if (newUser) {
            let message = "Sorry a user with this email already exists"
            return res.status(400).json({ success, message });
        }
        // Generating salt and hash of password
        const salt = await bcrypt.genSalt(10);
        const securedPassword = await bcrypt.hash(req.body.values.password, salt)

        // Creating a new user in the DB
        newUser = await User.create({
            username: req.body.values.name,
            email: req.body.values.email,
            password: securedPassword,
        });

        success = true
        let message = "Account registeration successful, Redirecting to Login"
        res.send({ success, message });

    } catch (error) {
        console.error(error.message);
        let success = false
        let message = "Internal Server error"
        res.status(500).send({ success, message });
    }
})

// ROUTE 2: Login User using: POST "/api/auth/login".
router.post('/login', async (req, res) => {

    let success = false;

    const { email, password } = req.body.values

    try {
        const newUser = await User.findOne({ email });

        if (!newUser) {
            let message = "Sorry, The email address you entered isn't registered."
            return res.status(400).json({ success, message })
        }

        const passwordCompare = await bcrypt.compare(password, newUser.password);
        if (!passwordCompare) {
            let message = "Invalid credentials!! Please try to login with correct credentials"
            return res.status(400).json({ success, message })
        }

        const userName = newUser.username;
        const isAdmin = newUser.isAdmin;

        const data = {
            newUser: {
                id: newUser.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);

        let message = "Logged in successfully"
        success = true;
        res.json({ message, success, authToken, userName, isAdmin })

    } catch (error) {
        console.error(error.message);
        let message = "Internal Server error"
        let success = false;
        res.status(500).send({ success, message });
    }
})

// ROUTE 3: Get Loggedin User details using: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        let userID = req.user.id;
        const getUser = await User.findById(userID).select("-password")
        res.send(getUser);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error");
    }
})


module.exports = router