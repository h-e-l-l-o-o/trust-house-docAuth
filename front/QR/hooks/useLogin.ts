import { useState } from "react";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const login = async (email: string, password: string, deviceId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/api/Auth/Login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email,
          password: password,
          deviceID: deviceId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        setError(errorData.errorMessage || "Invalid email or password");
        return;
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError("Something went wrong");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}
