import { useEffect, useState } from "react";
import styles from "./App.module.css";


function App() {
  type Account = {
    address: string;
    lamports: number;
    sol: number;
    usd: number;
  }

  const [data, setData] = useState<Account[] | null>(null);
  const [showUSD, setShowUSD] = useState<boolean>(false)

  useEffect(() => {
    fetch("/top20")
      .then((res) => res.json())
      .then((data) => setData(data))
  }, []);

  const listItems = data?.map((account: Account, index: number) =>
    <li className={styles.listItem} key={`li-${index}`}>
      <span hidden={showUSD}><span className={styles.amount}>{account.sol} SOL</span></span>
      <span hidden={!showUSD}><span className={styles.amount}>{monify(account.usd)}</span></span>
    </li>
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
        </div>
      </div>
    </div>
  );
}

export const monify = (n: number) => {
  const newNum = n.toFixed(2)
  const split = newNum.split(".")
  const firstHalf = split[0];
  const secondHalf = split[1];
  const newFirstHalf = Number(firstHalf).toLocaleString();
  return "$" + newFirstHalf + "." + secondHalf
}

export default App;