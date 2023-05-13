// Schemas
const User = require('./models/Users');

// For security
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = `my_IGN_is_It's_Handsome`;

// Logic to create a admin account
const createAdminUser = async () => {
    try {
        let adminName = 'John Doe'
        let adminEmail = 'johndoe@gmail.com'
        let adminPassword = 'password'

        const findUser = await User.findOne({ email: adminEmail });

        if (findUser) {
            console.log('User created already')
        }

        // Generating salt and hash of password
        const salt = await bcrypt.genSalt(10);
        const securedPassword = await bcrypt.hash(adminPassword, salt)

        // Creating a Admin user in the DB
        const newUser = new User({
            username: adminName,
            email: adminEmail,
            password: securedPassword,
        });

        // set the user as admin
        newUser.isAdmin = true;

        // save the user to the database
        await newUser.save()

        const data = {
            newUser: {
                id: newUser.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        console.log('Admin user created with auth-Token: ' + authToken)
    } catch (error) {
        console.error(error.message);
    }
}

module.exports = createAdminUser;