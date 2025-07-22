import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const roleHoc = (Wrapped, allowed) => (props) => {
  const { auth } = useAuth();
  if (!auth) return <Navigate to="/login" />;
  if (!allowed.includes(auth.role)) return <Navigate to="/dashboard" />;
  return <Wrapped {...props} />;
};

export default roleHoc;
