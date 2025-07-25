import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import NoAccess from "./components/NoAccess"; 
import AdminPanel from "./components/AdminPanel"; 
import ProfilePage from "./pages/ProfilePage";
import Layout from "./components/Layout"; 

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Всі захищені сторінки всередині ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout /* user={...} onLogout={...} */ />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
        {/* Сторінка без доступу */}
        <Route path="/no-access" element={<NoAccess />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
