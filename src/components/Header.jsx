
import styles from "./Header.module.css";
import UserInfo from "./UserInfo"; 

const Header = ({ user, onLogout }) => (
  <header className={styles.header}>
    <UserInfo user={user} onLogout={handleLogout} />
  </header>
);

export default Header;
