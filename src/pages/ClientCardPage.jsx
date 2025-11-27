//import { useNavigate } from "react-router-dom";
import ClientCard from "../components/clientCard/ClientCard";
import styles from "./ClientCardPage.module.css";
import { useState } from "react";

export default function ClientCardPage() {
  const [selectedClientName, setSelectedClientName] = useState("");

  //const navigate = useNavigate();

  return (
    <div className={styles.pageWrapper}>
      <h1 className={styles.title}>
        {selectedClientName || "Картка клієнта"}
      </h1>
      <ClientCard onClientChange={(name) => setSelectedClientName(name)}/>
    </div>
  );
}
