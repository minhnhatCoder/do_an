import { toast } from "react-toastify";
import PropTypes from "prop-types";

const Toast = (type = "", message, position = "top-right") => {
  return toast[type](`🦄 ${message}`, {
    position: position,
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
};
Toast.propTypes = {
  type: "info" || "success" || "warning" || "error" || "",
  message: PropTypes.string.isRequired,
  position: PropTypes.string,
};

export default Toast;
