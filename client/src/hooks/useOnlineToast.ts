import { useEffect } from "react";
import { toast } from "sonner";

export function useOnlineToast() {
  useEffect(() => {
    function handleOffline() {
      toast.warning("You are offline. Favorites remain available.");
    }
    function handleOnline() {
      toast.success("Back online");
    }
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);
}

