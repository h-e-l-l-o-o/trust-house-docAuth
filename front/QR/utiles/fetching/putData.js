export const putData = async (
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
      const response = await fetch(`${apiUrl}/${pathAndParams}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          //'Content-Type': 'application/json'
        },
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
