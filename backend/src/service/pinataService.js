var axios = require('axios');
require('dotenv').config()

async function getMetadataJSON(qid) {
  var config = {
    method: 'get',
    url: 'https://scarlet-weird-primate-290.mypinata.cloud/ipfs/'+qid,
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': process.env.PINATA_JWT
    }
  };
  
  // axios(config).then(function(res){
  //   console.log(res.data)
  // })

  const res = await axios(config)

  return res.data
}

async function uploadJSON(jsonfile) {
  var data = JSON.stringify({
    "pinataOptions": {
      "cidVersion": 1
    },
    "pinataMetadata": {
      "name": "testing.json",
    },
    "pinataContent": jsonfile  
  });
  
  var config = {
    method: 'post',
    url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': process.env.PINATA_JWT
    },
    data : data
  };
  
  const res = await axios(config);
  
  return res.data
}

module.exports = {
  uploadJSON,
  getMetadataJSON
}