import { useState, useEffect } from "react";
import { getData } from "@/utiles/fetching/getData";
import { postData } from "@/utiles/fetching/postData";
import { putData } from "@/utiles/fetching/putData";
import { downloadFile } from "@/utiles/fetching/downloadFile";
import { deleteData } from "@/utiles/fetching/deleteData";

export default function useDoc(jwt: string, fetchNewJwt: any, docID: any) {
  const [docs, setDocs] = useState<any>({ documents: [] });
  const [docLoading, setLoading] = useState(true);
  const [docRefresh, setDocRefresh] = useState<any>();

  useEffect(() => {
    setLoading(true);

    if (jwt && docID != undefined) {
      getData(
        jwt,
        setLoading,
        setDocs,
        fetchNewJwt,
        `api/Document?DocID=${docID}`
      );
      setLoading(false);
    }
  }, [jwt, docRefresh, docID]);

  return {
    docs,
    setDocRefresh,
    createDoc: (data: any) =>
      postData(
        jwt,
        setLoading,
        fetchNewJwt,
        data,
        "api/Document",
        "multipart/form-data"
      ),
    downloadDoc: (fileName: string) =>
      downloadFile(
        jwt,
        setLoading,
        fetchNewJwt,
        `api/Document/Download?fileName=${fileName}`
      ),
    editDoc: (data: any) =>
      putData(
        jwt,
        setLoading,
        fetchNewJwt,
        data,
        "api/Document",
        "multipart/form-data"
      ),

    deleteDoc: (docID: Number) =>
      deleteData(jwt, setLoading, fetchNewJwt, `api/document?DocID=${docID}`),

    docLoading,
  };
}
