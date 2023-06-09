var firebaseApp = require('firebase/app')
var firebaseDB = require('firebase/database')
const { randomNumberFromInterval } = require('../util/helper');
const { default: axios } = require('axios');
require('dotenv').config()


const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "blockchain-1d1bb.firebaseapp.com",
  databaseURL: "https://blockchain-1d1bb-default-rtdb.firebaseio.com",
  projectId: "blockchain-1d1bb",
  storageBucket: "blockchain-1d1bb.appspot.com",
  messagingSenderId: "90094015174",
  appId: "1:90094015174:web:041fc512beee2dc620fdc7",
  measurementId: "G-8ZM25TX5D0"
};

// Initialize Firebase
const app = firebaseApp.initializeApp(firebaseConfig)
const db = firebaseDB.getDatabase(app)

// wrtie
function writeMyContract(contractAddress, userAddress) {
  firebaseDB.push(firebaseDB.ref(db, '/user/'+ userAddress +'/contract'), contractAddress)

  console.log(`Write contract address to firebase/user/${userAddress} success!`)
}

function writeMyNFT(userAddress,receiptHash, nftMetadata, contractAddress, tokenid) {
  firebaseDB.push(firebaseDB.ref(db, '/user/'+ userAddress +'/nft/'+contractAddress), {
    Tokenid: tokenid,
    ReceiptHash: receiptHash,
    Metadata: nftMetadata,
  })

  console.log(`Write contract address to firebase/user/${userAddress} success!`)
}

async function getMyContract(userAddress) {
  var itemList = []

  const snapshot = await firebaseDB.get(firebaseDB.ref(db, '/user/'+userAddress+'/contract'))
  snapshot.forEach(function (s) {
        var obj = s.val()
        itemList.push(obj)
  })

  console.log(`Get contracts from firebase/user/${userAddress} success!`)

  return itemList
}

async function getMyJoinContract(userAddress) {
  var itemList = []
  
  const snapshot = await firebaseDB.get(firebaseDB.ref(db, '/user/'+userAddress+'/nft'))
  
  snapshot.forEach(function async(s) {
        itemList.push(s.key)
  })

  console.log(`Get nfts from firebase/user/${userAddress} success!`)

  return itemList
}

async function getMyNFT(userAddress) {
  var itemList = []
  
  const snapshot = await firebaseDB.get(firebaseDB.ref(db, '/user/'+userAddress+'/nft'))
  
  snapshot.forEach(function async(s) {
        var obj = s.val()

        let key =""
        let nfts = []

        for (var field in obj) {
          key = field;
          
          // let qid = obj[key].Metadata.slice(7)
          // var config = {
          //   method: 'get',
          //   url: 'https://scarlet-weird-primate-290.mypinata.cloud/ipfs/'+qid,
          //   headers: { 
          //     'Content-Type': 'application/json', 
          //     'Authorization': process.env.PINATA_JWT
          //   }
          // };
          
          // axios(config).then(function(res){
          //   console.log(res)
          // })

          nfts.push(obj[key])
        }

        itemList.push({
          contract: s.key,
          nfts: nfts
        })
  })

  console.log(`Get nfts from firebase/user/${userAddress} success!`)

  return itemList
}

module.exports = {
  writeMyNFT,
  writeMyContract,
  getMyContract,
  getMyNFT,
  getMyJoinContract
}