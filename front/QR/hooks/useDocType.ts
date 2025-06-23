import { useState, useEffect } from "react";
import { getData } from "@/utiles/fetching/getData";

export default function useDocType(jwt: string, fetchNewJwt: any) {
  const [docTypes, setDocTypes] = useState<any>([]);
  const [docLoading, setLoading] = useState(true);
  const [docTypesRefresh, setDocTypesRefresh] = useState();

  useEffect(() => {
    setLoading(true);

    if (jwt) {
      getData(jwt, setLoading, setDocTypes, fetchNewJwt, `api/DocType`);
      setLoading(false);
    }
  }, [jwt, docTypesRefresh]);

  return {
    docTypes,
    setDocTypesRefresh,
    docLoading,
  };
}
