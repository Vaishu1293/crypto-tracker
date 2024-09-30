import express from 'express';
import { fetchABIAndMetadata, getTransactions } from '../controllers/nftController.js'; // Import your controller function

const router = express.Router(); // Create a router

// Route to fetch ABI, metadata, and store it based on a dynamically generated contract address
router.get('/generate', fetchABIAndMetadata);

// Route to get transactions by address
router.get('/transactions/:address', getTransactions); // Use the controller


// Export the router, not an object
export default router;
