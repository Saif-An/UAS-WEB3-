const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Dummy transaction data
const dummyTransactions = [
  {
    id: 1,
    from: "0x123...",
    to: "0x456...",
    amount: "0.5 ETH",
    timestamp: "2025-01-12",
  },
  {
    id: 2,
    from: "0x789...",
    to: "0xabc...",
    amount: "1.2 ETH",
    timestamp: "2025-01-11",
  },
];

app.get("/api/transactions", (req, res) => {
  res.json({
    success: true,
    data: dummyTransactions,
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
