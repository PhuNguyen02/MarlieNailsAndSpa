import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import PricingPage from "@/pages/PricingPage";
import BookingPage from "@/pages/BookingPage";
import AdminLayout from "@/components/Admin/AdminLayout";
import AdminLoginPage from "@/pages/Admin/LoginPage";
import AdminDashboard from "@/pages/Admin/Dashboard";
import CalendarPage from "@/pages/Admin/CalendarPage";
import StaffManagement from "@/pages/Admin/StaffManagement";
import ShiftManagementPage from "@/pages/Admin/ShiftManagementPage";
import ProtectedRoute from "@/components/Admin/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/booking" element={<BookingPage />} />

      {/* Admin Auth */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="staff" element={<StaffManagement />} />
          <Route path="time-slots" element={<ShiftManagementPage />} />
          <Route path="settings" element={<div>Settings (Coming Soon)</div>} />
        </Route>
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
