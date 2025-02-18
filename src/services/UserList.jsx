import { useEffect, useState } from "react";
import { getUsers } from "../services/userService";

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Помилка отримання користувачів:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Список користувачів:</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.email} - {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
