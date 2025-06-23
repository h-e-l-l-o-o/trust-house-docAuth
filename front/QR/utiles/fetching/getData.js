export const getData = async (jwt, setLoading, setData, fetchNewJwt, pathAndParams) => {
  setLoading(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const makeRequest = async (token) => {
    try {
      const response = await fetch(`${apiUrl}/${pathAndParams}`, {
        method: "GET",
        credentials: "include",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
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
      setData(data.data);
    } catch (err) {
      return err;
    } finally {
      setLoading(false);
    }
  };

  return await makeRequest(jwt);
};
