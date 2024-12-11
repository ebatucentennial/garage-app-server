const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables as early as possible
dotenv.config();

const connectDB = require('./config/db');
const googlePlacesRoutes = require('./routes/googlePlacesRoutes');
const garageSaleRoutes = require('./routes/garageSaleRoutes');
const authRoutes = require('./routes/authRoutes'); 
const itemRoutes = require('./routes/itemRoutes'); 

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); 
app.use('/api/items', itemRoutes); 
app.use('/api/google-places', googlePlacesRoutes);
app.use('/api/garage-sales', garageSaleRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
