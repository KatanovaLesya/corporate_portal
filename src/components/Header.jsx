
import styles from "./Header.module.css";
import UserInfo from "./UserInfo"; 
import PropTypes from "prop-types";

const Header = ({ user, onLogout }) => (
  <header className={styles.header}>
    <UserInfo user={user} onLogout={onLogout} />
  </header>
);

Header.propTypes = {
  user: PropTypes.shape({
    avatarURL: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    telegram: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.string)
  }),
  onLogout: PropTypes.func
};
export default Header;
