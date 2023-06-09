require("dotenv").config()
const hre = require("hardhat")

const contractAddress = "0x152f7C77B1810d816e032a716225283D5b350bBE"
const web3 = new hre.ethers.providers.JsonRpcProvider("http://127.0.0.1:7545")
const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json")
const signer = new hre.ethers.Wallet("0x1873d3bbd467a749d126ab2ca471a582e412df3f5ebc6cb8e6ecd3f8056ee7cc", web3)
const nftContract = new hre.ethers.Contract(
  contractAddress,
  contract.abi,
  signer
)


async function mintNFT(tokenURI) {
  const unsignedTx = await nftContract.mintNFT("0x89020a57A6239C2F3374eAD388CC85DC2Ed0e119", tokenURI)

  //the transaction
  const tx = {
    from: "0x89020a57A6239C2F3374eAD388CC85DC2Ed0e119",
    to: contractAddress,
    data: unsignedTx.data,
  }

  const createReceipt = await signer.sendTransaction(tx)
  await createReceipt.wait();
  console.log(`Transaction successful with hash: ${createReceipt.hash}`);
}

async function main() {
  await mintNFT("ipfs://QmWyB4dGanAS3ckMwF5GTJGUs9ipNUjRNaDSsavJ4BnEmE")
}

main()
