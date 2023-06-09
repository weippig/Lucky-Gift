var firebaseApp = require('firebase/app')
var firebaseDB = require('firebase/database')
const { randomNumberFromInterval } = require('../util/helper')
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

// reset 
function resetDB(path) {
  firebaseDB.set(firebaseDB.ref(db, path), {})
}

// wrtie
function writeURL(contractAddress, URL) {
  firebaseDB.push(firebaseDB.ref(db, '/contract/'+ contractAddress+'/url/unsold'), URL)

  console.log(`Write urls to firebase/${contractAddress} success!`)
}

function writeTag(contractAddress, tag) {
  firebaseDB.push(firebaseDB.ref(db, '/contract/'+ contractAddress+'/tag'), tag)

  console.log(`Write tag to firebase/${contractAddress} success!`)
}

function writeHolder(contractAddress, holder) {
  firebaseDB.set(firebaseDB.ref(db, '/contract/'+ contractAddress+'/holder'), holder)

  console.log(`Write holder to firebase/${contractAddress} success!`)
}

function writeTotalCount(contractAddress, count) {
  firebaseDB.set(firebaseDB.ref(db, '/contract/'+ contractAddress+'/total'), count)

  console.log(`Write total count to firebase/${contractAddress} success!`)
}

function writeCount(contractAddress, count) {
  firebaseDB.set(firebaseDB.ref(db, '/contract/'+ contractAddress+'/count'), count)

  console.log(`Write count to firebase/${contractAddress} success!`)
}

function writeTitle(contractAddress, title) {
  firebaseDB.set(firebaseDB.ref(db, '/contract/'+ contractAddress+'/title'), title)

  console.log(`Write title to firebase/${contractAddress} success!`)
}

function writeDescription(contractAddress, description) {
  firebaseDB.set(firebaseDB.ref(db, '/contract/'+ contractAddress+'/description'), description)

  console.log(`Write description to firebase/${contractAddress} success!`)
}

function writeImageUrl(contractAddress, imageurl) {
  firebaseDB.set(firebaseDB.ref(db, '/contract/'+ contractAddress+'/imageurl'), imageurl)

  console.log(`Write imageURL to firebase/${contractAddress} success!`)
}


// get
async function getDescription(contractAddress) {
  const snapshot = await firebaseDB.get(firebaseDB.ref(db, '/contract/'+contractAddress+'/description'))
  return snapshot.val()
}

async function getImageUrl(contractAddress) {
  const snapshot = await firebaseDB.get(firebaseDB.ref(db, '/contract/'+contractAddress+'/imageurl'))
  return snapshot.val()
}

async function getTitle(contractAddress) {
  const snapshot = await firebaseDB.get(firebaseDB.ref(db, '/contract/'+contractAddress+'/title'))
  return snapshot.val()
}

async function getCount(contractAddress) {
  const snapshot = await firebaseDB.get(firebaseDB.ref(db, '/contract/'+contractAddress+'/count'))
  return snapshot.val()
}

async function getUnsoldURL(contractAddress) {
  const itemList = []

  const snapshot = await firebaseDB.get(firebaseDB.ref(db, '/contract/'+contractAddress+'/url/unsold'))
  snapshot.forEach(function (s) {
        var obj = s.val()
        itemList.push(obj)
  })

  console.log(`Get unsold urls from firebase/${contractAddress} success!`)

  return itemList
}

async function getSoldURL(contractAddress) {
  const itemList = []

  const snapshot = await firebaseDB.get(firebaseDB.ref(db, '/contract/'+contractAddress+'/url/sold'))
  snapshot.forEach(function (s) {
        var obj = s.val()
        itemList.push(obj)
  })

  // console.log(`Get sold urls from firebase/${contractAddress} success!`)

  return itemList
}

async function getTags(contractAddress) {
  const itemList = []

  const snapshot = await firebaseDB.get(firebaseDB.ref(db, '/contract/'+contractAddress+'/tag'))
  snapshot.forEach(function (s) {
        var obj = s.val()
        itemList.push(obj)
  })

  // console.log(`Get tags from firebase/${contractAddress} success!`)

  return itemList
}

// 回傳現在所有 contract
async function getAllContract() {
  var itemList = []

  const snapshot = await firebaseDB.get(firebaseDB.ref(db, '/contract/'))
  snapshot.forEach(function (s) {
        var obj = s.key
        itemList.push(obj)
  })

  // console.log(`Get contracts from firebase/ success!`)

  return itemList
}

async function getURLAndDelete(contractAddress) {
  const itemList = []

  const snapshot = await firebaseDB.get(firebaseDB.ref(db, '/contract/'+contractAddress+'/url/unsold'))
  snapshot.forEach(function (s) {
        itemList.push([s.key, s.val()])
  })

  const randomIndex = randomNumberFromInterval(itemList.length, 1)-1
  const randomItem = itemList[randomIndex]
  const sold = {
    key: randomItem[0],
    value: randomItem[1]
  }

  console.log(`Remove ${'/contract/'+contractAddress+'/url/unsold'+sold.key}`)

  firebaseDB.push(firebaseDB.ref(db, '/contract/'+ contractAddress+'/url/sold'), sold.value)
  await firebaseDB.remove(firebaseDB.ref(db, '/contract/'+contractAddress+'/url/unsold/'+sold.key))

  const count = itemList.length - 1
  writeCount(contractAddress, count)

  return sold.value
}

module.exports = { 
  resetDB, 
  getCount, 
  getUnsoldURL, 
  getSoldURL,
  writeCount, 
  writeURL, 
  writeTitle,
  writeHolder,
  writeTotalCount,
  writeTag,
  getAllContract, 
  getURLAndDelete,
  writeDescription,
  writeImageUrl,
  getDescription,
  getImageUrl,
  getTitle,
  getTags
}

