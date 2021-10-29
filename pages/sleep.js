import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import buttonStyle from "../styles/Button.module.css";
import Link from "next/link";

export default function Home() {
  const {
    query: { day = "XXXXXXXX" },
  } = useRouter();
  const [data, setData] = useState({ loading: true });

  useEffect(() => {
    fetch(`/api/sleep/${day}`)
      .then((response) => response.json())
      .then((data) => setData(data));
  }, [day]);

  const year = parseInt(day.substring(2, 4));
  const month = parseInt(day.substring(4, 6));
  const date = parseInt(day.substring(6, 8));

  const updateData = () => {
    fetch(`/api/update`)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Baby Calc</title>
      </Head>

      <nav>
        <Link href={{ pathname: "/" }}>
          <a className={buttonStyle["pure-material-button-contained"]}>Home</a>
        </Link>
      </nav>

      {day !== "XXXXXXXX" && (
        <main className={styles.main}>
          <h1 className={styles.title}>Day: {`${month}/${date}/${year}`}</h1>
          {!data.loading && (
            <>
              <h2>
                {new Date(data.wakeWindow.dayStart).toLocaleTimeString()} to{" "}
                {new Date(data.wakeWindow.dayEnd).toLocaleTimeString()}
              </h2>
              <p>
                <h3>
                  <em>Hours:</em>{" "}
                  {Number.parseFloat(data.wakeWindow.totalHours, 3).toPrecision(
                    2
                  )}
                </h3>
              </p>{" "}
            </>
          )}
        </main>
      )}
      <footer className={styles.footer}>
        <p>BabyCalc</p>
      </footer>
    </div>
  );
}
