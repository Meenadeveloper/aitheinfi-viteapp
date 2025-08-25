// RouteGuard.tsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RouteGuard: React.FC = () => {
  const location = useLocation();

  // Get localStorage data
  const uniqueCodeData = localStorage.getItem("uniqueCodeData");
  const parsed = uniqueCodeData ? JSON.parse(uniqueCodeData) : null;

  const isVerified = parsed?.status === true;

  // If verified → allow `/welcome` and `/`
  if (isVerified) {
    if (location.pathname === "/" || location.pathname === "/welcome") {
      return <Outlet />; // allow rendering the children
    } else {
      return <Navigate to="/welcome" replace />;
    }
  }

  // Not verified → force redirect to `/`
  if (location.pathname !== "/") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RouteGuard;
