const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const axios = require('axios');

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

// Modified Request schema to include prediction data
const requestSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    itemDetails: { type: String, required: true },
    address: { type: String, required: true },
    pickupDate: { type: String, required: true },
    pickupTime: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'verified', 'completed'],
        default: 'pending'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: { type: String, default: '' },
    isPaid: { type: Boolean, default: false },
    isCollected: { type: Boolean, default: false },
    predictionData: {
        itemType: String,
        brand: String,
        age: Number,
        condition: String,
        weight: Number,
        materialComposition: String,
        batteryIncluded: String,
        visibleDamage: String,
        screenCondition: String,
        rustPresence: String,
        wiringCondition: String,
        resalePotential: String
    },
    predictionResult: {
        scrapPrice: Number,
        repairCost: Number,
        finalAmount: Number
    },
    report: {
        reportId: String,
        verificationDate: Date,
        customerDetails: {
            name: String,
            phone: String,
            address: String,
            pickupDate: String,
            pickupTime: String
        },
        itemDetails: String,
        predictionDetails: {
            scrapPrice: Number,
            repairCost: Number,
            finalAmount: Number
        },
        paymentStatus: String,
        collectionStatus: String
    }
}, { timestamps: true });

const Request = mongoose.model('Request', requestSchema);

// User schema remains the same
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

// Existing auth routes remain the same
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
                id: user._id.toString(),
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Modified requests routes
app.get('/api/requests/:userId', async (req, res) => {
    try {
        if (!req.params.userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        
        const requests = await Request.find({ assignedTo: req.params.userId });
        res.json(requests);
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ message: 'Error fetching requests' });
    }
});

// New prediction endpoint that proxies to Python server
app.post('/api/predict', async (req, res) => {
    try {
        const response = await axios.post('http://localhost:5001/predict', req.body);
        res.json(response.data);
    } catch (error) {
        console.error('Prediction Error:', error);
        res.status(500).json({ 
            message: 'Error getting prediction',
            error: error.response?.data || error.message 
        });
    }
});

// Modified update endpoint
app.put('/api/requests/:requestId', async (req, res) => {
    try {
        const {
            amount,
            isPaid,
            isCollected,
            predictionData,
            predictionResult
        } = req.body;

        const status = isPaid && isCollected ? 'completed' : 'verified';

        const report = {
            reportId: `REP-${req.params.requestId}-${Date.now()}`,
            verificationDate: new Date(),
            customerDetails: {
                name: req.body.customerName,
                phone: req.body.phone,
                address: req.body.address,
                pickupDate: req.body.pickupDate,
                pickupTime: req.body.pickupTime
            },
            itemDetails: req.body.itemDetails,
            predictionDetails: predictionResult,
            paymentStatus: isPaid ? 'Paid' : 'Pending',
            collectionStatus: isCollected ? 'Collected' : 'Pending'
        };

        const updatedRequest = await Request.findByIdAndUpdate(
            req.params.requestId,
            {
                amount,
                isPaid,
                isCollected,
                predictionData,
                predictionResult,
                report,
                status
            },
            { new: true }
        );

        res.json(updatedRequest);
    } catch (error) {
        console.error('Error updating request:', error);
        res.status(500).json({ message: 'Error updating request' });
    }
});

app.post('/api/requests', async (req, res) => {
    try {
        const newRequest = new Request(req.body);
        await newRequest.save();
        res.status(201).json(newRequest);
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({ message: 'Error creating request' });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));