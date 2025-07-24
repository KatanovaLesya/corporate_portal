import { useEffect, useState } from "react";
import {
  getUsers,
  getRoles,
  addUserRole,
  removeUserRole
} from "../services/adminService";
import { ROLE_ICON_MAP, ROLE_LABELS } from "../icons/roleIcons";
import styles from "./AdminPanel.module.css";

const ACTIVE_COLOR = "#D32F2F";
const INACTIVE_COLOR = "#bbb";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  // Завантаження користувачів і ролей
  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, rolesRes] = await Promise.all([getUsers(), getRoles()]);
      setUsers(usersRes);
      setRoles(rolesRes);
    } catch (err) {
      setStatus("Помилка завантаження користувачів або ролей");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line
  }, []);

  // Додаємо/видаляємо роль
  const handleToggleRole = async (user, role) => {
    setStatus("");
    try {
      const hasRole = user.roles.includes(role);
      if (hasRole) {
        await removeUserRole(user.id, role);
      } else {
        await addUserRole(user.id, role);
      }
      await fetchData();
      setStatus("✅ Оновлено!");
    } catch (err) {
      setStatus("❌ Помилка при оновленні ролі");
    }
  };

  if (loading) return <div>Завантаження...</div>;

  return (
    <div className={styles.panelContainer}>
      <h2 className={styles.heading}>Призначення ролей</h2>
      <div className={styles.legend}>
        {roles.map(role => {
          const Icon = ROLE_ICON_MAP[role];
          if (!Icon) return null;
          return (
            <span key={role} className={styles.legendItem}>
              <Icon color={ACTIVE_COLOR} size={12} />
              <span className={styles.legendLabel}>{ROLE_LABELS[role]}</span>
            </span>
          );
        })}
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Ім’я</th>
            <th className={styles.th}>Керування</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td className={styles.td}>{u.name}</td>
              <td className={`${styles.td} ${styles.roleIconseCell}`}>
                {roles.map(role => {
                  const Icon = ROLE_ICON_MAP[role];
                  if (!Icon) return null;
                  const isActive = u.roles.includes(role);
                  return (
                    <span
                      key={role}
                      onClick={() => handleToggleRole(u, role)}
                      title={role}
                      className={styles.roleIcon + " " + (isActive ? styles.roleIconactive : styles.roleIconInactive)} 
                    >
                      <Icon color={isActive ? ACTIVE_COLOR : INACTIVE_COLOR} size={28} />
                    </span>
                  );
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {status && <div className={styles.statusMsg}>{status}</div>}
    </div>
  );
};

export default AdminPanel;