import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { LOCAL_STORAGE_USER_KEY } from "../constant";

const ProtectedRoute = () => {
  const token = localStorage.getItem(LOCAL_STORAGE_USER_KEY);

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
