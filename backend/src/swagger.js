const swaggerAutogen = require('swagger-autogen')();

const doc = {
  tags: [ // by default: empty Array
    {
      name: "NFT",
      description: "與合約、NFT 相關的 api"
    },
    {
      name: "Firebase",
      description: "與 Firebase 內合約資訊做交互的 api "
    },
    {
      name: "Pinata",
      description: "與上傳 metadata.json 相關的 api"
    },
    {
      name: "User",
      description: "與 Firebase 內用戶資訊做交互的 api "
    }
  ],
}

const outputFile = './swagger_output.json'; // 輸出的文件名稱
const endpointsFiles = ['./app.js']; // 要指向的 API，通常使用 Express 直接指向到 app.js 就可以

swaggerAutogen(outputFile, endpointsFiles, doc); // swaggerAutogen 的方法
