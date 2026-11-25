const express = require('express');
const cors = require('cors');

const { connectDB, sequelize } = require('./config/db');

const authRoutes = require('./router/authRoutes');
const postRoutes = require('./router/postRoutes');

const User = require('./model/user');
const Post = require('./model/post');
const clubRoutes = require('./router/clubRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/clubs', clubRoutes);

const PORT = 3000;

const startServer = async () => {
    try {
        await connectDB();

        await sequelize.sync();

        console.log('Database synchronized successfully!');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

startServer();