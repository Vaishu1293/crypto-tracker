import express from 'express';
import cors from 'cors';
import config from './config/config.js';  // Add `.js` for local files
import NFTRoutes from './routes/nft.js';
import logger from './middleware/logger.js';
import connectDB from './config/db.js';  // Import DB connection

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());
app.use(logger);

// Routes

app.use('/api/nft', NFTRoutes);

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});
