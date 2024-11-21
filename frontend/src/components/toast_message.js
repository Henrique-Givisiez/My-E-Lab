import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const showToastMessage = (message, success = false) => {
    if (success) {
        toast.success(message, {
            position: "top-right",
        });
    } else {
        toast.error(`Erro: ${message}`, {
            position: "top-right",
        });
    }
}

export default showToastMessage;