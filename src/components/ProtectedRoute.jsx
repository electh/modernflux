import { useStore } from "@nanostores/react";
import { Navigate } from "react-router-dom";
import { authState, logout } from "@/stores/authStore";

export default function ProtectedRoute({ children }) {
  const $auth = useStore(authState);

  if (!$auth.serverUrl || !$auth.apiKey) {
    logout();
    return <Navigate to="/login" replace />;
  }

  return children;
} 