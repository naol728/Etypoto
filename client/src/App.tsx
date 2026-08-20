import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./store/hook";
import { initAuth, setUser } from "./store/slice/auth";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import PhoneNumberSetup from "./components/PhoneNumberSetup";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/user/Home";
import MainLayout from "./components/MainLayout";
import Wallet from "./pages/user/Wallet";
import P2P from "./pages/user/P2P";
import Orders from "./pages/user/Orders";
import Profile from "./pages/user/Profile";
import Kyc from "./pages/user/Kyc";

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
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/p2p" element={<P2P />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/kyc" element={<Kyc />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

      </Routes>
      <Toaster />
    </>
  );
}

export default App;