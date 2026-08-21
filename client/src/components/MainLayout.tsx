import { Outlet } from "react-router-dom";
import Header from "./Header";
import NavBar from "./NavBar";

export default function MainLayout() {
  return (
    <div className="bg-background">
      <Header />

      <main className="min-h-screen ">
        <Outlet />
      </main>

      <NavBar />
    </div>
  );
}