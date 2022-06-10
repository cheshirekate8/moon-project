import { useState, useEffect } from "react";
import styles from "./App.module.css";


function App() {
  const [data, setData] = useState<any>(null);
  const [showUSD, setShowUSD] = useState<boolean>(false)

  useEffect(() => {
    fetch("/top20")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  const listItems = data?.map((account: any, index: number) =>
    <>
      <li hidden={showUSD} className={styles.listItem}><span className={styles.amount}>{account.sol} SOL</span></li>
      <li hidden={!showUSD} className={styles.listItem}><span className={styles.amount}>${(account.usd).toFixed(2)}</span></li>
    </>
  );

  const handleChange = () => {
    setShowUSD(!showUSD)
  }

  return (
    <div className={styles.App}>
      <div className={styles.wrapper}>
        <img src="/solanaLogo.svg" alt="Solana logo" className={styles.logo}></img>
        <div className={styles.top20Div}>
          <header>Top 20 Accounts</header>
          <label className={styles.toggleSwitch}>
            <span className={styles.toggleText}></span>
            <input type="checkbox" checked={showUSD} onChange={handleChange}></input>
            <span className={styles.switch} />
          </label>
          {
            data ?
              <ul className={styles.list}>
                {listItems}
              </ul>
              :
              <p> Loading... </p>
          }
          {/* <button onClick={handleChange} className={styles.convertButton}>Change to {showUSD ? "SOL" : "USD"}</button> */}
        </div>
      </div>
    </div>
  );
}

export default App;