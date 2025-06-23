import Chip from "@mui/material/Chip";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShoppingCart from "@mui/icons-material/ShoppingCart";

export const renderStatusChip = (status, script) => {
  switch (status) {
    case "Created By Manager":
      return <Chip dir="ltr" label={script.madeByManager} icon={<SupervisorAccountIcon />} color="info" />;
    case "pending":
      return <Chip dir="ltr" label={script.pending} icon={<PendingIcon />} color="warning" />;
    case "rejected":
      return <Chip dir="ltr" label={script.rejected} icon={<CancelIcon />} color="error" />;
    case "accepted":
      return <Chip dir="ltr" label={script.accepted} icon={<CheckCircleIcon />} color="success" />;
    case "buying supplies":
      return <Chip dir="ltr" label={script.buyingSupplies} icon={<ShoppingCart />} color="secondary" />;
    default:
      return <Chip dir="ltr" label={status || "Unknown"} color="secondary" />;
  }
};
