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
    fetch(`/api/update`);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Baby Calc - {`${month}/${date}/${year}`}</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👶</text></svg>"
        ></link>
      </Head>

      <nav>
        <Link href={{ pathname: "/" }}>
          <a className={buttonStyle["pure-material-button-contained"]}>Home</a>
        </Link>
      </nav>

      {day !== "XXXXXXXX" && (
        <main className={styles.main}>
          <h1 className={styles.title}>{`${month}/${date}/${year}`}</h1>
          {!data.loading && (
            <>
              <h2>
                {new Date(data.wakeWindow.dayStart).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                to{" "}
                {new Date(data.wakeWindow.dayEnd).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </h2>
              <h3>
                <em>Wake Hours:</em>{" "}
                {Number.parseFloat(data.wakeWindow.totalHours, 3).toPrecision(
                  2
                )}
              </h3>

              <h2 style={{ paddingTop: "50px" }}>Nap Times &amp; Lengths</h2>
              <table>
                <thead>
                  <th>Start</th>
                  <th>End</th>
                  <th>Duration (Minutes)</th>
                </thead>
                <tbody>
                  {data.wakeWindow.naps.map((n, index) => (
                    <tr key={index}>
                      <td>
                        {new Date(n.time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td>
                        {n.duration > 0
                          ? new Date(n.end).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </td>
                      <td align="right">{n.duration > 0 ? n.duration : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
