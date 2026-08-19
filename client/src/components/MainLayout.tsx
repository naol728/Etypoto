import { Outlet } from "react-router-dom";
import Header from "./Header";
import NavBar from "./NavBar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="min-h-screen pb-24">
        <Outlet />
      </main>

      <NavBar />
    </div>
  );
}