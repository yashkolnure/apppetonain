import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

// Pages
import Loginfree from "./pages/loginfree";
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard";
import BulkUploadInfo from "./pages/bulkuploadinfo";

/* ================= SAFE TOKEN EXPIRY CHECK ================= */
const isTokenExpired = (token) => {
  try {
    if (!token) return true;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

/* ================= PROTECTED ROUTE ================= */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const restaurantId = localStorage.getItem("restaurantId");

  // ❌ Not logged in
  if (!token || !restaurantId) {
    return <Navigate to="/" replace />;
  }

  // ❌ Token expired
  if (isTokenExpired(token)) {
    localStorage.clear();
    return <Navigate to="/" replace />;
  }

  // ✅ Authorized
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Home / Login */}
        <Route path="/" element={<Loginfree />} />

        {/* Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Bulk Upload (FIXED) */}
        <Route
          path="/bulk-upload"
          element={
            <ProtectedRoute>
              <BulkUploadInfo />
            </ProtectedRoute>
          }
        />

        {/* Restaurant Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
