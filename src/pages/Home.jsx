
import styles from "../pages/Home.module.css";
import { signInWithGoogle } from "../services/authService";

const Home = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to Corporate Portal</h1>
      <p className={styles.description}>Sign in to access the platform.</p>

      <div className={styles.buttonContainer}>
        <button className={styles.googleButton} onClick={signInWithGoogle}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Home;

