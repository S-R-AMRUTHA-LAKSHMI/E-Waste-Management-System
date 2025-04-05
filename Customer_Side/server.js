const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/userdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// User schema and model
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true, 
        trim: true 
    },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Signup route
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email: email.toLowerCase(),
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ success: false, message: 'Error registering user' });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        res.status(200).json({ 
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT})`));