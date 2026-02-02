import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "./ContractConnect";

function BalanceDisplay() {
  const [contractBalance, setContractBalance] = useState("0");
  const [userBalance, setUserBalance] = useState("0");

  const updateBalances = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);

        // 1. Ambil Saldo Kontrak (Total Dana Terkumpul)
        const cBalance = await provider.getBalance(contractAddress);
        setContractBalance(ethers.formatEther(cBalance));

        // 2. Ambil Saldo User (Dompet yang sedang konek)
        const signer = await provider.getSigner();
        const uAddress = await signer.getAddress();
        const uBalance = await provider.getBalance(uAddress);
        setUserBalance(ethers.formatEther(uBalance));
      }
    } catch (error) {
      console.error("Gagal mengambil saldo:", error);
    }
  };

  useEffect(() => {
    updateBalances();
    // Opsional: Refresh saldo setiap 15 detik
    const interval = setInterval(updateBalances, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        marginBottom: "20px",
      }}
    >
      <div style={cardStyle("#e3f2fd")}>
        <h4>💰 Total Donasi Terkumpul</h4>
        <h2>{contractBalance} ETH</h2>
        <small>Target Kontrak: {contractAddress.substring(0, 10)}...</small>
      </div>

      <div style={cardStyle("#f1f8e9")}>
        <h4>👛 Saldo Dompet</h4>
        <h2>{parseFloat(userBalance).toFixed(4)} ETH</h2>
        <p>Sepolia Testnet</p>
      </div>
    </div>
  );
}

const cardStyle = (color) => ({
  flex: 1,
  padding: "20px",
  backgroundColor: color,
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
});

export default BalanceDisplay;
