import { CheckCircle, RemoveCircle, Visibility, SupervisorAccount, Work } from "@mui/icons-material";

export const getRoleColor = (roleId) => {
  switch (roleId) {
    case 3:
      return "red";
    case 1:
      return "#b88d1a";
    case 2:
      return "green";
    case 5:
      return "blue";
    default:
      return "gray";
  }
};

export const getRoleIcon = (roleId) => {
  switch (roleId) {
    case 3:
      return <RemoveCircle color="error" />;
    case 1:
      return <Visibility color="warning" />;
    case 2:
      return <SupervisorAccount color="success" />;
    case 5:
      return <Work color="primary" />;
    default:
      return <CheckCircle sx={{ color: getRoleColor(roleId) }} />;
  }
};
