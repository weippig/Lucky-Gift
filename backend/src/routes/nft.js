const express = require("express")
const hre = require("hardhat")
const fs = require('fs')
const { 
  writeURL,
  writeCount,
  getUnsoldURL,
  writeTitle,
  getAllContract,
  writeTotalCount,
  writeDescription,
  getDescription,
  writeImageUrl,
  writeHolder,
  writeTag,
  getImageUrl,
  getSoldURL,
  getTitle,
  getTags
} = require('../service/firebaseService')

require('dotenv').config()

const router = express.Router()

const {
  writeMyContract,
  writeMyNFT,
} = require('../service/userService')

const { 
  getURLAndDelete,
} = require('../service/firebaseService')

var provider
if(process.env.MODE == "dev"){
	provider = new hre.ethers.providers.JsonRpcProvider(process.env.LOCAL_URL)
} else {
	provider = new hre.ethers.providers.AlchemyProvider("goerli", process.env.GOERLI_URL)
}

var signer 
if(process.env.MODE == "dev"){
	signer = new hre.ethers.Wallet(process.env.LOCAL_PRIVATE_KEY, provider)
} else {
	signer = new hre.ethers.Wallet(process.env.GOERLI_PRIVATE_KEY, provider)
}

const contractAbi = fs.readFileSync("./artifacts/contracts/MyNFT.sol/MyNFT.json")

router.post("/mint", async function (req, res) {
	// #swagger.tags = ['NFT']

	const { contractAddress, receiver } = req.body
	
	const metadataURI = "ipfs://" + await getURLAndDelete(contractAddress)
	const nftContract = new hre.ethers.Contract(
		contractAddress,
		JSON.parse(contractAbi).abi,
		signer
	)
	
	let nftTxn = await nftContract.mintNFT(receiver, metadataURI)
  const rc = await nftTxn.wait()
  console.log(`NFT Minted! Check it out at: https://goerli.etherscan.io/tx/${nftTxn.hash}`)
	
	const event = rc.events.find(event => event.event === 'Transfer');
	const [from, to, value] = event.args;
	console.log("from:", from)
	console.log("to:", to)
	console.log("value:", value)

	let result = {
		contract: contractAddress,
    receiver: receiver,
		tokenId: value.toNumber(),
    receiptHash: nftTxn.hash
	};

	writeMyNFT(receiver, nftTxn.hash, metadataURI, contractAddress, value.toNumber())

	res.status(200).json(result);
});

router.post("/deploy", async function (req, res) {
	// #swagger.tags = ['NFT']
	
	const { name, abbreviation, title, description, imageUrl, metadataUrls, holder, tags } = req.body
	// const { title, contractAddress, description, imageUrl, metadataUrls, holder, tags } = req.body
	console.log(req.body)

	const MyNFT = await hre.ethers.getContractFactory("MyNFT", signer)
  const myNFT = await MyNFT.deploy(name, abbreviation)

	await myNFT.deployed()

	console.log("Contract deployed to address:", myNFT.address)

	let contractAddress = myNFT.address

	for (let i = 0; i < tags.length; i++) {
    writeTag(contractAddress, tags[i])
  }

  for (let i = 0; i < metadataUrls.length; i++) {
    writeURL(contractAddress, metadataUrls[i])
  }

  writeHolder(contractAddress, holder)
  writeTitle(contractAddress, title)
  writeTotalCount(contractAddress, metadataUrls.length)
  writeCount(contractAddress, metadataUrls.length)
  writeDescription(contractAddress, description)
  writeImageUrl(contractAddress, imageUrl)

	writeMyContract(myNFT.address, holder)
	
	const result = {
		address: myNFT.address
	}
	res.status(200).json(result);
})

module.exports = router;