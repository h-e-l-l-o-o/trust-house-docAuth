export const deleteData = async (jwt, setLoading, fetchNewJwt, pathAndParams) => {
  setLoading(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const makeRequest = async (token) => {
    try {
      const response = await fetch(`${apiUrl}/${pathAndParams}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
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
      console.log("Error in createTransaction:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return await makeRequest(jwt);
};
