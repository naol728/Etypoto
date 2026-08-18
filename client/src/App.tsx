import { useEffect, useState } from "react";
import { useAppDispatch } from "./store/hook";
import { initAuth } from "./store/slice/auth";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

function App() {
  const dispatch = useAppDispatch();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await dispatch(initAuth());
      } catch (err: unknown) {

        let message = "Initialization failed";

        if (err instanceof Error) {
          message = err.message;
        } else if (typeof err === "string") {
          message = err;
        }

        toast.error(message);
      } finally {
        setReady(true);
      }
    };

    init();
  }, [dispatch]);

  if (!ready) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>etypoto</div>

      <Toaster />
    </>
  );
}

export default App;