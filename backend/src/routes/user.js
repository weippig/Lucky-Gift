const express = require("express")
require('dotenv').config()

const router = express.Router()
const {
  getMyNFT,
  getMyContract,
  getMyJoinContract
} = require('../service/userService')

router.get("/mycontract/:useraddress", async function(req, res){
  // #swagger.tags = ['User']
  const userAddress  = req.params.useraddress

  contracts = await getMyContract(userAddress)

  res.status(200).json({
    contracts: contracts
  })
}) 


router.get("/nfts/:useraddress", async function(req, res){
  // #swagger.tags = ['User']
  const userAddress  = req.params.useraddress

  data = await getMyNFT(userAddress)

  res.status(200).json({
    nfts: data
  })
}) 


router.get("/mycontract/join/:useraddress", async function(req, res){
  // #swagger.tags = ['User']
  const userAddress  = req.params.useraddress

  data = await getMyJoinContract(userAddress)

  res.status(200).json({
    contracts: data
  })
}) 


module.exports = router;