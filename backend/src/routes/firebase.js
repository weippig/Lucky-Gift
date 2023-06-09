const express = require("express")
require('dotenv').config()
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

const {
  writeMyContract,
  writeMyNFT
} = require('../service/userService')

const router = express.Router()

router.get("/read/:address", async function(req, res) {
  // #swagger.tags = ['Firebase']

  const  contractAddress  = req.params.address

  const title = await getTitle(contractAddress)
  const unsoldUrls = await getUnsoldURL(contractAddress)
  const soldUrls = await getSoldURL(contractAddress)
  const des = await getDescription(contractAddress)
  const imageurl = await getImageUrl(contractAddress)
  const tags = await getTags(contractAddress)

  res.status(200).json({
    contractAddress: contractAddress,
    title: title,
    unsoldUrls: unsoldUrls,
    soldUrls: soldUrls,
    tags: tags,
    description: des,
    imageUrl: imageurl
  })
})

router.post("/store", async function(req,res){
  // #swagger.tags = ['Firebase']

  const { title, contractAddress, description, imageUrl, metadataUrls, holder, tags } = req.body

  for (let i = 0; i < tags.length; i++) {
    if(tags != ""){
      writeTag(contractAddress, tags[i])
    }
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
  
  res.status(200).json()
})

router.get("/contracts", async function(req, res) {
  // #swagger.tags = ['Firebase']

  const contracts  = await getAllContract()
  // let res = []
  // for(let i=0; i<contracts.length; i++) {
  //   contractAddress = contracts[i]
  //   res.push(
  //     {
  //       contractAddress: contractAddress,
  //       title: await getTitle(contractAddress),
  //       unsoldUrls: await getUnsoldURL(contractAddress),
  //       soldUrls: await getSoldURL(contractAddress),
  //       imageUrl: await getImageUrl(contractAddress),
  //     }
  //   )
  // }

  res.status(200).json({
    contracts: contracts
  })
})

// router.put("/get_random", async function(req, res) {
//   // #swagger.tags = ['Firebase']

//   const { contractAddress } = req.body
//   const url = await getURLAndDelete(contractAddress)

//   res.status(200).json({
//     url: url
//   })
// })


module.exports = router;