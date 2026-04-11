import { useEffect, useState } from "react";

import useUserStore from "./store/useUserStore";
import { axiosInstance } from "./services/urlService";
import Spinner from "./utils/Spinner";
import { Navigate, Outlet, useLocation } from "react-router";

export function ProtectedRoute() {
  const [isChecking, setIsChecking] = useState(true);
  let location = useLocation();
  const { isAuthenticated, setUser, clear } = useUserStore() as { isAuthenticated: boolean; setUser: (user: any) => void; clear: () => void };

  async function checkAuth() {
    try {
      let response = await axiosInstance.post("/api/auth/checkauth");
      console.log(response.data);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        let response = await checkAuth();
        if (response?.data.isAuthenticated) {
          setUser(response.data.user);
        } else {
          clear();
        }
      } catch (error) {
        console.log(error);
        clear();
      } finally {
        setIsChecking(false);
      }
    };

    verifyAuth();
  }, [setUser, clear]);

  if (isChecking) {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

 return <Outlet />
}

export function PublicRoute(){
  const isAuthenticated=useUserStore((state:any)=>state.isAuthenticated);

  if(isAuthenticated){
    return <Navigate to="/" replace />
  }

  return <Outlet />
}