import { Navigate, Route, Routes } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { useAuth } from "./auth/useAuth";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { PublicOnlyRoute } from "./auth/PublicOnlyRoute";
import { Layout } from "./components/Layout";
import { LoadingSpinner } from "./components/LoadingSpinner";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import PaymentOrderListPage from "./pages/PaymentOrderListPage";
import PaymentOrderEditPage from "./pages/PaymentOrderEditPage";
import SavedRecipientListPage from "./pages/SavedRecipientListPage";
import SavedRecipientEditPage from "./pages/SavedRecipientEditPage";

const CatchAllRedirect = () => {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? "/" : "/login"} replace />;
};

function App() {
  const { isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<PaymentOrderEditPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="history" element={<PaymentOrderListPage />} />
          <Route path="history/new" element={<PaymentOrderEditPage />} />
          <Route path="history/:id" element={<PaymentOrderEditPage />} />
          <Route path="receivers" element={<SavedRecipientListPage />} />
          <Route path="receiver/new" element={<SavedRecipientEditPage />} />
          <Route path="receiver/:id" element={<SavedRecipientEditPage />} />
        </Route>
      </Route>

      <Route path="*" element={<CatchAllRedirect />} />
    </Routes>
  );
}

export default App;
