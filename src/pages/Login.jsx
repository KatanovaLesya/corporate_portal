import styles from "../pages/Home.module.css";
import { signInWithGoogle } from "../services/authService";

const Login = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Login</h1>
      <p className={styles.description}>Sign in to continue.</p>

      <button className={styles.googleButton} onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
