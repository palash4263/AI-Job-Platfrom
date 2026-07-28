import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import Jobs from "../pages/Jobs";

const AppRoutes = () => {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/jobs" element={<Jobs />} />
        
        {/* Redirect /apply to /dashboard where auto-apply core resides */}
        <Route path="/apply" element={<Navigate to="/dashboard" replace />} />
        
        {/* Wildcard fallback redirects to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

    </BrowserRouter>
  );
};

export default AppRoutes;