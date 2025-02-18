import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Navbar = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <nav>
      <Link to="/">Home</Link> | 
      <Link to="/profile">Profile</Link> | 
      <Link to="/admin">Admin Panel</Link> | 
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default Navbar;
