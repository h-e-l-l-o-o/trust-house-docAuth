export const hasRole = (names, perms, page) => {
  const perm = perms.find(p => p.PageName == page)
  return names.some((name) => perm && perm.RoleName === name);
};
