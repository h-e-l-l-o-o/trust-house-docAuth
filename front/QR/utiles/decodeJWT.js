export function decodeJwt(token) {
  if (!token) {
    console.error("No token provided.");
    return [];
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    console.error("Invalid JWT format.");
    return [];
  }

  try {
    const payload = JSON.parse(atob(parts[1]));
    const permissions = JSON.parse(payload.Roles);
    return permissions;
  } catch (error) {
    console.error("Failed to decode JWT:", error.message);
    return [];
  }
}
