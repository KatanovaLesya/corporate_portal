import styles from "../pages/Dashboard.module.css"; 
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const UserInfo = ({ user, onLogout }) => {
  const navigate = useNavigate();
  if (!user) return null;

  return (
    <div className={styles["user-info-top-right"]}>
      <img src={user.avatarURL} alt={user.name} className={styles["user-info__avatar"]} />
      <div>
        <span className={styles["user-info__name"]}>{user.name}</span>
        <div className={styles["user-info__email"]}>{user.email}</div>
        <div className={styles["user-info__roles"]}>
          {user.roles && user.roles.length > 0 ? user.roles.join(", ") : "Немає ролей"}
        </div>
      </div>
      <div className={styles["user-info-buttons"]}>
        <button className={styles["profile-btn"]} onClick={() => navigate("/profile")}>PROFILE</button>
        <button className={styles["logout-btn"]} onClick={onLogout}>LOGOUT</button>
      </div>
    </div>
  );
};
UserInfo.propTypes = {
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
export default UserInfo;
