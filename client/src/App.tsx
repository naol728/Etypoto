
import { useEffect, useState } from 'react';
import { useAppDispatch } from './store/hook';
import { initAuth } from './store/slice/auth';
import { Toaster } from "@/components/ui/sonner"
import { toast } from 'sonner';

function App() {
  const dispatch = useAppDispatch();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    async function init() {
      try {
        await dispatch(initAuth()).unwrap();

      } catch (err: unknown) {
        let message = "Initialization failed";
        if (err instanceof Error) {
          message = err.message;
        }
        toast.error(message);
      } finally {
        setReady(true);
      }
    }

    init();
  });


  if (!ready) {
    return (
      <>loading
      </>
    );
  }

  return (
    <>
      etypoto
      <Toaster />

    </>
  )
}

export default App
