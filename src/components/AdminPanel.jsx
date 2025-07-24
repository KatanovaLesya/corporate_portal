import { useEffect, useState } from "react";
import {
  getUsers,
  getRoles,
  addUserRole,
  removeUserRole
} from "../services/adminService";
import { ROLE_ICON_MAP } from "../icons/roleIcons";

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
    <div style={{ padding: "32px" }}>
      <h1>🛠️ Адмін-панель</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "16px" }}>
        <thead>
          <tr style={{ background: "#fafafa" }}>
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>Ім’я</th>
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>Керування</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td style={{ padding: "8px", border: "1px solid #ccc" }}>{u.name}</td>
              <td style={{ padding: "8px", border: "1px solid #ccc", display: "flex", gap: "12px" }}>
                {roles.map(role => {
                  const Icon = ROLE_ICON_MAP[role];
                  if (!Icon) return null;
                  const isActive = u.roles.includes(role);
                  return (
                    <span
                      key={role}
                      onClick={() => handleToggleRole(u, role)}
                      title={role}
                      style={{
                        cursor: "pointer",
                        opacity: isActive ? 1 : 0.5,
                        transition: "opacity 0.2s",
                        marginRight: "10px",
                        borderRadius: "50%",
                        padding: "4px",
                        background: isActive ? "#ffeaea" : "transparent"
                      }}
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
      {status && <div style={{ marginTop: 20, fontWeight: "bold" }}>{status}</div>}
    </div>
  );
};

export default AdminPanel;