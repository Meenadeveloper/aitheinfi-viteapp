import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface AuthProtectedProps {
  children: ReactNode;
}

const AuthProtected: React.FC<AuthProtectedProps> = ({ children }) => {
  // Retrieve and parse uniqueCodeData from localStorage
  const uniqueCodeData = localStorage.getItem("uniqueCodeData");
  let uniqueCode: string | undefined;
  let isVerified = false;

  if (uniqueCodeData) {
    try {
      const parsed = JSON.parse(uniqueCodeData);
      uniqueCode = parsed?.unique_code;
      isVerified =
        parsed?.status === true &&
        typeof uniqueCode === "string" &&
        uniqueCode.length > 0;
    } catch {
      isVerified = false;
    }
  }

  // Check for access_token
  const accessToken = localStorage.getItem("access_token");

  // If unique code and access token are valid, allow access
  if (isVerified && accessToken) {
    return <>{children}</>;
  }

  // Redirect to login if not authenticated
  // return <Navigate to="/login" replace />;
    return <Navigate to="/" replace />;

};

export default AuthProtected;
