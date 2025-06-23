"use client"

import React, { createContext, useContext, useEffect, useState } from "react";
import { decodeJwt } from "@/utiles/decodeJWT";

const AuthContext = createContext();

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const AuthProvider = ({ children }) => {
  const [jwt, setJwt] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [perms, setPerms] = useState([]);

  const fetchNewJwt = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/Auth`, {
        credentials: "include",
      });
      
      if (response.ok) {
          if (window.location.pathname == "/") {
            window.location.href = "dashboard";
          }
      }

      const data = await response.json();
      const decoded = decodeJwt(data.data);
      setJwt(data.data);
      setPerms(decoded || []);
    } catch (err) {
      setAuthError(err.message);
    }
  };

  useEffect(() => {
    if (!jwt) {
      fetchNewJwt();
    }
  }, []);

  if(jwt){
    
  }

  return (
    <AuthContext.Provider value={{ jwt, authError, fetchNewJwt, perms }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
