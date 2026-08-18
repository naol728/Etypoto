import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./store/hook";
import { initAuth, setUser } from "./store/slice/auth";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import PhoneNumberSetup from "./components/ui/PhoneNumberSetup";

function App() {
  const dispatch = useAppDispatch();

  const user = useAppSelector(
    (state) => state.auth.user,
  );

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await dispatch(initAuth()).unwrap();
      } catch (err: unknown) {
        console.error(
          "Initialization error:",
          err,
        );

        const message =
          err instanceof Error
            ? err.message
            : "Initialization failed";

        toast.error(message);
      } finally {
        setReady(true);
      }
    };

    init();
  }, [dispatch]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }



  if (user && !user.phone) {
    return (
      <>
        <PhoneNumberSetup
          onComplete={(phone) => {

            dispatch(
              setUser({
                ...user,
                phone,
              }),
            );
          }}
        />

        <Toaster />
      </>
    );
  }



  return (
    <>
      <div>etypoto</div>

      <Toaster />
    </>
  );
}

export default App;