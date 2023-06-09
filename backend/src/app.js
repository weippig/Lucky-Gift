const express = require('express')
const bodyParser = require("body-parser")
const swaggerUi = require("swagger-ui-express")
const swaggerFile = require('./swagger_output.json')
const cors = require('cors')
const app = express()

app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use(cors());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

// Enable bodyParser
app.use(express.json())

// Public folder
app.use(express.static('public'))

// app.use("/books", require("./routes/books"))
app.use("/nft", require("./routes/nft"))
app.use("/firebase", require("./routes/firebase"))
app.use("/pinata", require("./routes/pinata"))
app.use("/user", require("./routes/user"))

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})