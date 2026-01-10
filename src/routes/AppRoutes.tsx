import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import Unauthorized from "@/pages/Unauthorized";
import Dashboard from "@/components/Dashboard";
import PrivateRoute from "./PrivateRoute";
import EnterprisesList from "@/pages/super-admin/EnterprisesList";
import CustomersList from "@/pages/admin/CustomersList";
import TravelersList from "@/pages/admin/TravelersList";
import BusesList from "@/pages/admin/BusesList";
import HotelsList from "@/pages/admin/HotelsList";
import PackagesTrips from "@/pages/admin/PackagesTrips";
import POS from "@/pages/admin/POS";
import Financial from "@/pages/admin/Financial";
import AdminSettings from "@/pages/admin/AdminSettings";
import AttendantCustomers from "@/pages/attendant/AttendantCustomers";
import AttendantPOS from "@/pages/attendant/AttendantPOS";

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route index element={<Home />} />

          <Route
            path="enterprises"
            element={
              <ProtectedRoute allowedRoles={["super_admin"]}>
                <EnterprisesList />
              </ProtectedRoute>
            }
          />

          <Route
            path="registrations/customers"
            element={
              <ProtectedRoute allowedRoles={["admin", "attendant"]}>
                {(() => {
                  const { role } = useAuth();
                  return role === "attendant" ? <AttendantCustomers /> : <CustomersList />;
                })()}
              </ProtectedRoute>
            }
          />

          <Route
            path="registrations/travelers"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <TravelersList />
              </ProtectedRoute>
            }
          />

          <Route
            path="registrations/buses"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <BusesList />
              </ProtectedRoute>
            }
          />

          <Route
            path="registrations/hotels"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <HotelsList />
              </ProtectedRoute>
            }
          />

          <Route
            path="packages-trips"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <PackagesTrips />
              </ProtectedRoute>
            }
          />

          <Route
            path="pos"
            element={
              <ProtectedRoute allowedRoles={["admin", "attendant"]}>
                {(() => {
                  const { role } = useAuth();
                  return role === "attendant" ? <AttendantPOS /> : <POS />;
                })()}
              </ProtectedRoute>
            }
          />

          <Route
            path="financial"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Financial />
              </ProtectedRoute>
            }
          />

          <Route
            path="financial/payables"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-slate-900">Payables - Coming Soon</h2>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="financial/receivables"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-slate-900">Receivables - Coming Soon</h2>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="financial/cash-control"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-slate-900">Cash Control - Coming Soon</h2>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="settings"
            element={
              <ProtectedRoute allowedRoles={["super_admin", "admin"]}>
                {(() => {
                  const { role } = useAuth();
                  return role === "super_admin" ? (
                    <div className="text-center py-12">
                      <h2 className="text-2xl font-bold text-slate-900">System Settings</h2>
                    </div>
                  ) : (
                    <AdminSettings />
                  );
                })()}
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
