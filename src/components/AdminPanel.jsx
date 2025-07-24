import { useEffect, useState } from "react";
import {
  getUsers,
  getRoles,
  addUserRole,
  removeUserRole
} from "../services/adminService";

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
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>Email</th>
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>Ролі</th>
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>Керування</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td style={{ padding: "8px", border: "1px solid #ccc" }}>{u.name}</td>
              <td style={{ padding: "8px", border: "1px solid #ccc" }}>{u.email}</td>
              <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                {u.roles && u.roles.length > 0 ? u.roles.join(", ") : <span style={{ color: "#aaa" }}>—</span>}
              </td>
              <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                {roles.map(role => (
                  <label key={role} style={{ marginRight: 12 }}>
                    <input
                      type="checkbox"
                      checked={u.roles.includes(role)}
                      onChange={() => handleToggleRole(u, role)}
                    />
                    {role}
                  </label>
                ))}
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
