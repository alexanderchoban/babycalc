import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import buttonStyle from "../styles/Button.module.css";
import Link from "next/link";
import { useState } from "react";

export default function Home({ dates }) {
  const [updatedData, setUpdatedData] = useState(false);

  const updateData = () => {
    fetch(`/api/update`);
    setUpdatedData(true);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Baby Calc</title>
      </Head>

      <nav>
        <button
          onClick={updateData}
          disabled={updatedData}
          className={buttonStyle["pure-material-button-contained"]}
        >
          Update Data
        </button>
      </nav>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <br />
          <strong>Baby Calc</strong>
        </h1>

        <p className={styles.description}>Click a day below to get started</p>

        {dates && (
          <ul className={styles.datebtns}>
            {dates.map(({ display, key }) => (
              <li key={key}>
                <Link href={{ pathname: "/sleep", query: { day: key } }}>
                  <a className={buttonStyle["pure-material-button-contained"]}>
                    {display}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>

      <footer className={styles.footer}>
        <p>BabyCalc</p>
      </footer>
    </div>
  );
}

export async function getServerSideProps() {
  const dates = [];

  for (let i = 0; i < 7; i++) {
    let d = new Date();
    d.setDate(d.getDate() - i);

    const year = d.getFullYear();
    const month = d.getMonth();
    const day = d.getDate();

    dates.push({
      display: d.toLocaleDateString(),
      key: `${year}${month + 1}${day}`,
    });
  }

  return {
    props: { dates }, // will be passed to the page component as props
  };
}
