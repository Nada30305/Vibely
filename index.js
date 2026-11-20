
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { connectDB } = require('./db');
const eventSearchRouter = require('./router/eventSearchRouter');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to Vibely API'
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Vibely API is running'
    });
});

app.use('/api/events', eventSearchRouter);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Server startup failed:', error.message);
        process.exit(1);
    }
};

startServer();
