export const downloadFile = async (
  jwt,
  setLoading,
  fetchNewJwt,
  pathAndParams
) => {
  setLoading(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL; 
  
  let currentToken = jwt;

  const attemptFetch = async () => {
    const res = await fetch(`${apiUrl}/${pathAndParams}`, {
      method: "GET",
      credentials: "include", 
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (res.status === 401) {
      const newJwt = await fetchNewJwt();
      if (!newJwt) {
        throw new Error("JWT expired and refresh failed.");
      }
      currentToken = newJwt;
      return attemptFetch();
    }

    if (!res.ok) {
      throw new Error(`Download failed (status ${res.status}).`);
    }

    const blob = await res.blob();

    let fileName = "downloaded-file";
    const contentDisp = res.headers.get("Content-Disposition");
    if (contentDisp) {
      const match = contentDisp.match(/filename="?([^"]+)"?/);
      if (match && match[1]) {
        fileName = match[1];
      }
    }

    const objectUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(objectUrl);
  };

  try {
    await attemptFetch();
  } catch (error) {
    console.error("DownloadFile error:", error);
  } finally {
    setLoading(false);
  }
};
