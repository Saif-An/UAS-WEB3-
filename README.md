DAPP DONASI

Aplikasi donasi terdesentralisasi berbasis Blockchain yang memungkinkan transparansi penuh dalam melacak saldo kontrak dan riwayat transaksi.

Fitur Utama

- Wallet Connection: Integrasi dengan MetaMask.
- Balance Dashboard: Menampilkan saldo di dompet dan total donasi yang terkumpul di Smart Contract.
- Transaction List : Riwayat donasi real-time dari blockchain.
- Desain Responsif: Tampilan optimal di Desktop maupun Mobile menggunakan CSS Grid & Flexbox.

Tech Stack
Smart Contract
-Solidity: Bahasa pemrograman kontrak.
-Ethereum Remix IDE : Kompilasi dan Deployment.
-Network: Ethereum Sepolia Testnet.

Backend

- Express: Framework server.
- Cors : Izin akses lintas domain.
- Nodemon : Auto-restart server saat pengembangan.

Frontend (React)

- Ethers.js : Library untuk interaksi dengan Blockchain.
- CSS Grid & Flexbox : Layout responsif dan modern.

Langkah Instalasi

1. Smart Contract
   1. Buka [Remix IDE](https://remix.ethereum.org/?#nomobileredirect&lang=en&optimize&runs=200&evmVersion&version=soljson-v0.8.31+commit.fd3a2265.js).
   2. Compile file `.sol`.
   3. Deploy ke Sepolia Tesnet (MetaMask) pada jaringan Sepolia.
   4. Salin "Contract Address" dan "ABI" ke frontend.

2. Frontend
   cd frontend
   npx create-react-app
   npm i ethers
   npm run dev

3. Backend
   cd backend
   npm install express cors nodemon
   npm start
