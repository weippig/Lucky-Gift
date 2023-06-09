# Lucky-Gift
NFT Gachapon Machine (♡˙︶˙♡)

## How to start 
### Prerequisite
1. Install Node.js 
2. Install Ganache 
3. Install Hardhat 
4. Install Metamask in your browser (ex. Chrome)
5. Firebase realtime database
6. Register in Pinata and get jwt key

### Install Packages
Run `npm install ` in frontend folder & backend folder seperately to install required packages.

### Compile smart contract
Go to backend folder and run below command to compile solidity smart contract, which will generate a folder named `artifacts`.
```
cd backend
npx hardhat compile
```
### Configuration
Copy a file named `.env` from `.env.example`
```
cp .env.example .env
```
Change setting in `.env.example` file.

## How to Run
### Run Ganache 
RPC server sholud be run on port 7545.

### Setting .env
`LOCAL_URL` and `MODE` don't need to change.
```
LOCAL_URL="http://127.0.0.1:7545"
LOCAL_PRIVATE_KEY="YOUR Ganache account private key"
FIREBASE_API_KEY="YOUR Firebase API key"
PINATA_JWT = "YOUR Pinata jwt"
MODE="dev"
```

### Run frontend
Run `npm run start` in frontend folder.
React app default port is 3000.

### Run backend 
Run `npm run start` in backend folder. 
Express server run on port 3001.