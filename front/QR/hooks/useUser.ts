import { useState, useEffect } from "react";
import { getData } from "@/utiles/fetching/getData";
import { postData } from "@/utiles/fetching/postData";
import { deleteData } from "@/utiles/fetching/deleteData";

export default function useUser(jwt: string, fetchNewJwt: any, userID: any) {
  const [users, setUsers] = useState<any>([]);
  const [userLoading, setLoading] = useState(true);
  const [userRefresh, setUserRefresh] = useState<any>();

  useEffect(() => {
    setLoading(true);

    if (jwt && userID != undefined) {
      getData(
        jwt,
        setLoading,
        setUsers,
        fetchNewJwt,
        `api/User?userID=${userID}`
      );
      setLoading(false);
    }
  }, [jwt, userRefresh, userID]);

  return {
    users,
    setUserRefresh,
    createUser: (data: any) =>
      postData(jwt, setLoading, fetchNewJwt, data, "api/User"),
    deleteUser: (userID: Number) =>
      deleteData(jwt, setLoading, fetchNewJwt, `api/User?UserID=${userID}`),
    setUserRoles: (data: any) =>
      postData(jwt, setLoading, fetchNewJwt, data, "api/Auth/SetUserRole"),
    userLoading,
  };
}
