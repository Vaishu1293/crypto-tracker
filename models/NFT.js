import mongoose from 'mongoose';

const NFTSchema = new mongoose.Schema({
  tokenId: {
    type: String,
    required: true,
    unique: true,
  },
  contractAddress: {
    type: String,
    required: true,
  },
  name: String,
  description: String,
  image: String,
});

const NFTModel = mongoose.model('NFT', NFTSchema);

// Export using ES modules
export default NFTModel;

// // Method to calculate hash using SHA256
// BlockSchema.methods.calculateHash = function () {
//     return crypto.SHA256(
//         this.index +
//         this.previousHash +
//         this.timestamp +
//         JSON.stringify(this.data) +
//         this.nonce
//     ).toString();
// };

// // Method to mine the block by finding the right hash based on the difficulty
// BlockSchema.methods.mineBlock = function (difficulty) {
//     while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
//         this.nonce++;
//         this.hash = this.calculateHash();
//     }
//     console.log(`Block mined: ${this.hash}`);
// };

