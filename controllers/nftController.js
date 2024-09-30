
import Web3 from 'web3';
import axios from 'axios';
import fetch from 'node-fetch';
import NFTModel from '../models/NFT.js';
import abi from './MyNFT-abi.json' assert { type: 'json' };

// Connect to Ethereum node through Infura or Alchemy
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL));
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const getTransactions = async (req, res) => {
  const address = req.params.address;
  
  const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=5&sort=desc&apikey=${process.env.ETHERSCAN_API_KEY}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === '1') {
      return res.json(response.data.result); // Send the result to the client
    } else {
      return res.status(404).json({ message: 'No transactions found' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
};

// Generate a random Ethereum address (for testing)
// Function to generate a random Ethereum-like contract address with mixed-case
const generateRandomContractAddress = () => {
  const hexChars = 'abcdef0123456789ABCDEF'; // Include uppercase letters for mixed-case
  let address = '0x'; // Ethereum addresses start with '0x'

  // Generate 40 characters for the address
  for (let i = 0; i < 40; i++) {
    address += hexChars[Math.floor(Math.random() * hexChars.length)];
  }

  return '0xd8f24f5f0382e197c1e87ad82b357209383470cf';
};


const fetchABIAndMetadata = async (req, res) => {
  try {
    // Generate a random contract address
    const contractAddress = generateRandomContractAddress();

    // Fetch the ABI dynamically from Etherscan
    const abiResponse = await axios.get(`https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${ETHERSCAN_API_KEY}`);

    // Check if the ABI is available
    if (abiResponse.data.status !== '1') {
      return res.status(400).json({ message: 'Invalid contract address or ABI not available' });
    }

    // const contractABI = JSON.parse(abiResponse.data.result);

    // const contractAddress = '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4';
    // const contractABI = abi.abi;

    // Initialize contract instance using the ABI and generated contract address
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    // Fetch the tokenURI for a sample tokenId (e.g., tokenId = 1 for testing)
    const tokenId = 3; // For testing purposes, use tokenId = 1
    const tokenURI = await contract.methods.tokenURI(tokenId).call({
      gas: 500000
    }
    );

    // Fetch metadata from the token URI
    const metadataResponse = await fetch(tokenURI);
    const metadata = await metadataResponse.json();

    // Store the metadata in MongoDB
    const nft = new NFT({
      tokenId,
      contractAddress,
      name: metadata.name,
      description: metadata.description,
      image: metadata.image,
    });

    await nft.save();

    // Return the metadata as the response
    res.json({
      contractAddress,
      tokenId,
      metadata,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error retrieving metadata',
      error: error.message,
    });
  }
};

// Export the function (named export)
export { 
  fetchABIAndMetadata,
  getTransactions
 };
// If you need to export default:
const nftController = { 
  fetchABIAndMetadata,
  getTransactions
 };

export default nftController;

