// Layout.jsx
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser, signOut } from "../services/authService";

const Layout = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const u = await getCurrentUser();
      setUser(u);
    })();
  }, []);

  const onLogout = () => {
    signOut();
    window.location.href = "/";
  };

  return (
    <>
      <Header user={user} onLogout={onLogout} />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
