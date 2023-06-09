const express = require("express")
require('dotenv').config()

const { uploadJSON, getMetadataJSON } = require("../service/pinataService")

const router = express.Router()

router.post("/upload_json", async function(req, res) {
  // #swagger.tags = ['Pinata']
  const { jsonfile } = req.body

  const data = await uploadJSON(jsonfile)

  res.status(200).json(data)
})

router.get("/get_metadata/:qid", async function(req, res) {
  // #swagger.tags = ['Pinata']
  const qid  = req.params.qid

  const data = await getMetadataJSON(qid)

  res.status(200).json(data)
})



module.exports = router