import Header from "./Header";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser, signOut } from "../services/authService";

const Layout = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    (async () => {
      const u = await getCurrentUser();
      setUser(u);
      setLoading(false);
      if (!u) navigate("/");
    })();
  }, [navigate]);


  const onLogout = () => {
    signOut();
    setUser(null);
    navigate("/");
  };

  if (loading) return <div> Завантаження... </div>;

  return (
    <>
      <Header user={user} onLogout={onLogout} />
      <main>
        <Outlet context={{ user, setUser }} />
      </main>
    </>
  );
};

export default Layout;
