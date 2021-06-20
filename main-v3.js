// Mining rewards.
// This allows for persons to get rewards for minning, and earn coins.


const SHA256 = require('crypto-js/sha256');

class Transaction{
  constructor(fromAddress, toAddress, amount){
    this.fromAddress= fromAddress;
    this.toAddress= toAddress;
    this.amount= amount;
  }
}

class Block{
  constructor(timestamp, transactions, previousHash =''){
    this.timestamp= timestamp;
    this.transactions= transactions;
    this.previousHash= previousHash;
    this.hash= this.calculateHash();
    this.nonce=0;
  }
  calculateHash(){
    return SHA256( + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce ).toString();
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
    this.difficulty= 2;
    this.pendingTransactions= [];
    this.miningReward= 100;
  }
  createGenesisBlock(){
    return new Block("01/01/2020","this is the genesis block","0");
  }
  getLatestBlock(){
    return this.chain[this.chain.length-1];
  }

  minePendingTransactions(miningRewardAddress){
    let block= new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);
    console.log("BLOCK SUCCESFULLY MINED");
    // this.chain.push(block);
    this.pendingTransactions.push(new Transaction(null,miningRewardAddress, this.miningReward));
    this.chain.push(block);
    this.pendingTransactions=[];
    // this.pendingTransactions= [
    //   new Transaction(null,minigRewardAddress, this.miningReward)
    // ];
  }

  createTransactions(transaction){
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address){
    let balance = 0;
    for(const block of this.chain){
      for(const trans of block.transactions){
        if (trans.fromAddress === address){
          balance -= trans.amount;
        }
        if (trans.toAddress === address){
          balance += trans.amount;
        }
      }
    }
    return balance;
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

JEMcoin.createTransactions(new Transaction('address 1', 'address 2', 100));
JEMcoin.createTransactions(new Transaction('address 2', 'address 1', 50));

console.log('\n \n starting the miner...')
JEMcoin.minePendingTransactions('xmyaddres');
console.log('balance of My is: '+ JEMcoin.getBalanceOfAddress('xmyaddres'));


console.log('\n \n starting the miner again...')
JEMcoin.minePendingTransactions('xmyaddres');
console.log('balance of My is: '+ JEMcoin.getBalanceOfAddress('xmyaddres'));


console.log('\n \n starting the miner again...')
JEMcoin.minePendingTransactions('xmyaddres');
console.log('balance of My is: '+ JEMcoin.getBalanceOfAddress('xmyaddres'));