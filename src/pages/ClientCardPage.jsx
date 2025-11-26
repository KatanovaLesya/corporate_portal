//import { useNavigate } from "react-router-dom";
import ClientCard from "../components/clientCard/ClientCard";
import styles from "./ClientCardPage.module.css";

export default function ClientCardPage() {
  //const navigate = useNavigate();

  return (
    <div className={styles.pageWrapper}>
      <h1 className={styles.title}>Картка клієнта</h1>
      <ClientCard />
    </div>
  );
}
