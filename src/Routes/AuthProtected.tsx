import type { ReactNode } from "react";
// import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Navigate, } from "react-router-dom";

interface AuthProtectedProps {
  children: ReactNode;
}

const AuthProtected: React.FC<AuthProtectedProps> = ({ children }) => {
  // const location = useLocation();

  // // Get localStorage data
  // const uniqueCodeData = localStorage.getItem("uniqueCodeData");
  // const parsed = uniqueCodeData ? JSON.parse(uniqueCodeData) : null;

  // const isVerified = parsed?.status === true;

  // // If verified → allow `/welcome` and `/`
  // if (isVerified) {
  //   if (location.pathname === "/" || location.pathname === "/welcome") {
  //     return <Outlet />; // allow rendering the children
  //   } else {
  //     return <Navigate to="/dashboard" replace />;
  //   }
  // }

  // // Not verified → force redirect to `/`
  // if (location.pathname !== "/") {
  //   return <Navigate to="/" replace />;
  // }

  if (!localStorage.getItem("access_token")) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default AuthProtected;
