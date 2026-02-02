import "./App.css";
import WalletConnect from "./components/WalletConnect";
import TransactionList from "./components/TransactionList";
import BalanceDisplay from "./components/BalanceDisplay";

function App() {
  return (
    <div className="App">
      <nav className="navbar">
        <div className="logo">DApp Donasi</div>
        <WalletConnect />
      </nav>

      <header className="hero-section">
        <h1>Welcome to Web3 Giving</h1>
        <p>Transparansi donasi melalui jaringan Sepolia Blockchain.</p>
      </header>

      <main className="main-grid">
        <section className="balance-area">
          <BalanceDisplay />
        </section>

        <section className="transaction-area">
          <TransactionList />
        </section>
      </main>
    </div>
  );
}

export default App;
