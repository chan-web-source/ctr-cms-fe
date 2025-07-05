import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

export const handleError = (error: AxiosError) => {
  if (axios.isAxiosError(error)) {
    const err = error.response;
    if (err?.data && Array.isArray((err.data as any).errors)) {
      for (let val of (err.data as any).errors) {
        toast.warning(val.description);
      }
    } else if (err?.data && typeof (err.data as any).errors === "object") {
      for (let e in (err.data as any).errors) {
        toast.warning((err.data as any).errors[e][0]);
      }
    } else if (err?.data) {
      toast.warning(err.data as string);
    } else if (err?.status == 401) {
      toast.warning("Please login");
      window.history.pushState({}, "Login", "/login");
    } else if (err) {
      toast.warning(err.data as string);
    }
  }
};
