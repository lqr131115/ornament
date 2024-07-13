import styles from "./page.module.scss";
import { JsRoutes } from "@/constant/route";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.title}>
          <span className={styles.arrowRight}></span>
          <h1>Js</h1>
        </div>
        <ul className={styles.wrapper}>
          {JsRoutes.map((route, index) => (
            <li key={index} className={styles.route}>
              <a href={route.path}>{route.name}</a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
