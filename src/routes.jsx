import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import NoAccess from "./components/NoAccess"; 
import AdminPanel from "./components/AdminPanel"; 

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Всі захищені сторінки всередині ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Route>

        {/* 404, або сторінка без доступу */}
        <Route path="/no-access" element={<NoAccess />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
