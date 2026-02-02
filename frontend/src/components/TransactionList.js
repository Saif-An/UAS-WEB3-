import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "./ContractConnect";

function TransactionList() {
  const [apiTransactions, setApiTransactions] = useState([]);
  const [blockchainTransactions, setBlockchainTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // State baru untuk input donasi
  const [donationAmount, setDonationAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Ambil data dari API Backend
      const apiRes = await fetch("http://localhost:5000/api/transactions");
      const apiResult = await apiRes.json();
      if (apiResult.success) setApiTransactions(apiResult.data);

      // 2. Ambil data dari Blockchain (Sepolia)
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          provider,
        );

        const filter = contract.filters.DonationReceived();
        const events = await contract.queryFilter(filter, -1000, "latest");

        const history = await Promise.all(
          events.map(async (event, index) => {
            const block = await event.getBlock();
            return {
              id: `eth-${index}-${event.transactionHash}`,
              from: event.args[0],
              amount: ethers.formatEther(event.args[1]),
              timestamp: new Date(block.timestamp * 1000).toLocaleString(),
              isBlockchain: true,
            };
          }),
        );
        setBlockchainTransactions(history.reverse());
      }
    } catch (error) {
      console.error("Gagal sinkronisasi data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi Handle Donasi
  const handleDonation = async () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      alert("Masukkan jumlah ETH yang valid!");
      return;
    }

    try {
      setIsProcessing(true);
      if (!window.ethereum) throw new Error("MetaMask tidak ditemukan!");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(); // Perlu signer untuk transaksi

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer,
      );

      // Memanggil fungsi donate() di Smart Contract
      const tx = await contract.donate({
        value: ethers.parseEther(donationAmount),
      });

      console.log("Transaksi dikirim:", tx.hash);
      await tx.wait(); // Menunggu konfirmasi blockchain

      alert("Donasi Berhasil!");
      setDonationAmount(""); // Reset input
      fetchData(); // Refresh list agar transaksi baru muncul
    } catch (error) {
      console.error("Donasi gagal:", error);
      alert("Transaksi dibatalkan atau gagal.");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ marginTop: "20px", fontFamily: "Arial, sans-serif" }}>
      {/*Form Donasi */}
      <div
        style={{
          padding: "15px",
          backgroundColor: "#f0f7ff",
          borderRadius: "8px",
          marginBottom: "20px",
          border: "1px solid #b3d7ff",
        }}
      >
        <h3>Kirim Donasi ke Sepolia</h3>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="number"
            step="0.01"
            placeholder="Jumlah ETH"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              flex: 1,
            }}
          />
          <button
            onClick={handleDonation}
            disabled={isProcessing}
            style={{
              padding: "10px 20px",
              backgroundColor: isProcessing ? "#ccc" : "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isProcessing ? "not-allowed" : "pointer",
            }}
          >
            {isProcessing ? "Memproses..." : "Donasi Sekarang"}
          </button>
        </div>
      </div>

      <button
        onClick={fetchData}
        style={{ marginBottom: "10px", padding: "8px 12px", cursor: "pointer" }}
      >
        🔄 Refresh Semua Data
      </button>

      <div
        style={{
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <h3>Riwayat Transaksi Tergabung</h3>
        <table
          style={{
            width: "100%",
            textAlign: "left",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4" }}>
              <th style={{ padding: "10px" }}>Sumber</th>
              <th>Pengirim</th>
              <th>Jumlah</th>
              <th>Waktu</th>
            </tr>
          </thead>
          <tbody>
            {blockchainTransactions.map((tx) => (
              <tr
                key={tx.id}
                style={{ borderBottom: "1px solid #eee", color: "#2e7d32" }}
              >
                <td style={{ padding: "10px" }}>
                  <strong>⛓️ On-Chain</strong>
                </td>
                <td>{tx.from.substring(0, 6)}...</td>
                <td>{tx.amount} ETH</td>
                <td>{tx.timestamp}</td>
              </tr>
            ))}

            {apiTransactions.map((tx) => (
              <tr
                key={`api-${tx.id}`}
                style={{ borderBottom: "1px solid #eee", color: "#1976d2" }}
              >
                <td style={{ padding: "10px" }}>🌐 API Backend</td>
                <td>{tx.from.substring(0, 6)}...</td>
                <td>{tx.amount}</td>
                <td>{tx.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p>Menyinkronkan data...</p>}
        {!loading &&
          blockchainTransactions.length === 0 &&
          apiTransactions.length === 0 && (
            <p style={{ textAlign: "center", padding: "20px" }}>
              Belum ada transaksi.
            </p>
          )}
      </div>
    </div>
  );
}

export default TransactionList;
