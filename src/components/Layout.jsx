// src/components/Layout.jsx
import Header from "./Header";
import { Outlet } from "react-router-dom";
import PropTypes from "prop-types";

const Layout = ({ user, onLogout }) => (
  <>
    <Header user={user} onLogout={onLogout} />
    <main>
      <Outlet />
    </main>
  </>
);
Layout.propTypes = {
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
export default Layout;
