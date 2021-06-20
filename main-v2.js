//proof of work; a security measure that makes it very hard (not impossible) to illegally edit a block,
// the proof of work is a mechanism that requires that a node has consumed a necessary enough computing
// in order to qualify to add to the blockchain. the proces of generating a proof of work is what is termed as mining,
// proof of work in implementation like in bit coin, requires that the hash of a block should begin with 
// a certain number of zeros. This would mean the hashing process would have to be iterated until the hash meets
// that criterion. The number of zeros required is termed as the difficulty of te proof of work. The higher the
// difficulty, the more computing power and time will be used by a node.
// This proof of work methodology also helps to ease and control the rate of adding new blocks to the blockchain.


const SHA256 = require('crypto-js/sha256');

class Block{
  constructor(index, timestamp, data, previousHash =''){
    this.index= index;
    this.timestamp= timestamp;
    this.data= data;
    this.previousHash= previousHash;
    this.hash= this.calculateHash();
    this.nonce=0;
  }
  calculateHash(){
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce ).toString();
  }

  mineBlock(difficulty){
    while( this.hash.substring(0,difficulty) != Array(difficulty+1).join("0") ){
      this.nonce++;
      this.hash= this.calculateHash( );
    }
    console.log("Block mined: "+ this.hash);
  }
}

class Blockchain{
  constructor(){
    this.chain= [this.createGenesisBlock()];
    this.difficulty= 5;
  }
  createGenesisBlock(){
    return new Block(0,"01/01/2020","this is the genesis block","0");
  }
  getLatestBlock(){
    return this.chain[this.chain.length-1];
  }

  addBlock(newBlock){
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isChainValid(){
    for( let i=1; i<this.chain.length; i++){
      const currentBlock= this.chain[i];
      const previousBlock= this.chain[i-1];

      if(currentBlock.hash !== currentBlock.calculateHash()){
        return false;
      }
      if(currentBlock.previousHash !== previousBlock.hash){
        return false;
      }
    }
    return true;
  }
    
}


let JEMcoin = new Blockchain();

console.log("mining block 1....")
JEMcoin.addBlock( new Block(1, "10/01/2020", {amount:4}));
console.log("mining block 2....")
JEMcoin.addBlock( new Block(2, "11/01/2020", {amount:20}));
