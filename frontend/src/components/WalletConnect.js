import { ethers } from "ethers";
import { useState } from "react";

function WalletConnect() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const accounts = await provider.send("eth_requestAccounts", []);
        const address = accounts[0];
        const balanceWei = await provider.getBalance(address);
        const balanceEth = ethers.formatEther(balanceWei);

        setAccount(address);
        setBalance(balanceEth);
      } catch (error) {
        console.error("Error connecting wallet:", error);
        alert("Gagal menghubungkan wallet. Pastikan MetaMask terpasang.");
      }
    } else {
      alert("Silakan instal MetaMask!");
    }
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc" }}>
      <button onClick={connectWallet}>
        {account
          ? `Connected: ${account.substring(0, 6)}...${account.substring(38)}`
          : "Connect MetaMask"}
      </button>

      {/* Menampilkan Saldo */}
      {account && (
        <div style={{ marginTop: "10px" }}>
          <p>
            <strong>Wallet:</strong> {account}
          </p>
          <p>
            <strong>Balance:</strong>{" "}
            {balance ? parseFloat(balance).toFixed(4) : "0"} ETH (Sepolia)
          </p>
        </div>
      )}
    </div>
  );
}

export default WalletConnect;
