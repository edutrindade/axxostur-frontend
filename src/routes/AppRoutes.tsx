import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Login from "@/pages/Login";
import ForgotPassword from "@/pages/ForgotPassword";
import PreRegistration from "@/pages/PreRegistration";
import PreRegistrationSuccess from "@/pages/PreRegistrationSuccess";
import Home from "@/pages/Home";
import Users from "@/pages/Users";
import Clients from "@/pages/Clients";
import ClientCreate from "@/pages/ClientCreate";
import Enterprises from "@/pages/Enterprises";
import Tenants from "@/pages/Tenants";
import Reports from "@/pages/Reports";
import Dashboard from "@/components/Dashboard";
import PrivateRoute from "./PrivateRoute";
import TaxConsultPage from "@/pages/TaxConsultPage";

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/forgot-password" element={isAuthenticated ? <Navigate to="/" replace /> : <ForgotPassword />} />
        <Route path="/pre-registration" element={isAuthenticated ? <Navigate to="/" replace /> : <PreRegistration />} />
        <Route path="/pre-registration/success" element={isAuthenticated ? <Navigate to="/" replace /> : <PreRegistrationSuccess />} />

        {/* Rotas privadas */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="users" element={<Users />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/new" element={<ClientCreate />} />
          <Route path="clients/edit" element={<ClientCreate />} />
          <Route path="enterprises" element={<Enterprises />} />
          <Route path="tenants" element={<Tenants />} />
          {/* Forms handled via drawers inside Tenants and Enterprises pages */}
          <Route path="tax" element={<TaxConsultPage />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        {/* Rota de fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
