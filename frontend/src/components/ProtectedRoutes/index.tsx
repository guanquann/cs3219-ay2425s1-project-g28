import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import React from "react";

type ProtectedRoutesProps = { 
  adminOnly?: boolean;
};

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({ adminOnly = false }) => {
  const auth = useAuth();
  if (!auth) {
    throw new Error("useAuth() must be used within AuthProvider");
  }
  const { user } = auth;

  if (!user) {
    return <Navigate to="/" />;
  }
  
  if (adminOnly && !user.isAdmin) {
    // TODO: unauthorized page
    console.log("unauthorized");
    return <></>;
  } 
  
  return <Outlet />;
};

export default ProtectedRoutes;
