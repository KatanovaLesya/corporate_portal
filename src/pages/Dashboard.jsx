import styles from "./Dashboard.module.css"; 
import { modules } from "../config/modulesConfig";
import { Link, useOutletContext } from "react-router-dom";

const Dashboard = () => {
  const {user} = useOutletContext();

  if (!user) return null;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      <div className={styles.modulesSection}>
          <h2>Мої модулі</h2>
          <div className={styles.modulesGrid}>
            {modules
              .filter(m => user.roles.some(role => m.roles.includes(role)))
              .map(m => (
                <Link to={m.path} key={m.path} className={styles.moduleTile}>
                  <span className={styles.moduleIcon}>{m.icon}</span>
                  <span>{m.name}</span>
                </Link>
              ))}
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
