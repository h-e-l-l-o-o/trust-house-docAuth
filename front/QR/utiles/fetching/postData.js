export const postData = async (
  jwt,
  setLoading,
  fetchNewJwt,
  body,
  pathAndParams,
  contentType = "application/json"
) => {
  setLoading(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const makeRequest = async (token) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      if (contentType === "application/json") {
        headers["Content-Type"] = contentType;
      }

      const response = await fetch(`${apiUrl}/${pathAndParams}`, {
        method: "POST",
        credentials: "include",
        headers: headers,
        credentials: "include",
        body: contentType == "application/json" ? JSON.stringify(body) : body,
      });

      if (response.status === 401) {
        const newJwt = await fetchNewJwt();
        if (newJwt) {
          return await makeRequest(newJwt);
        } else {
          throw new Error("JWT expired and could not refresh");
        }
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error in createAccount:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return await makeRequest(jwt);
};
