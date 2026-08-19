import {
    Home,
    Wallet,
    ArrowLeftRight,
    ClipboardList,
    User,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
    {
        label: "Home",
        icon: Home,
        path: "/",
    },
    {
        label: "Wallet",
        icon: Wallet,
        path: "/wallet",
    },
    {
        label: "P2P",
        icon: ArrowLeftRight,
        path: "/p2p",
    },
    {
        label: "Orders",
        icon: ClipboardList,
        path: "/orders",
    },
    {
        label: "Profile",
        icon: User,
        path: "/profile",
    },
];

export default function NavBar() {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3">
            <div className="mx-auto flex h-16 max-w-md items-center justify-around rounded-2xl border bg-background/95 px-2 shadow-lg backdrop-blur-md">
                {navItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className="flex h-full flex-1 items-center justify-center"
                        >
                            {({ isActive }) => (
                                <div
                                    className={`flex min-w-[55px] flex-col items-center justify-center gap-1 rounded-xl px-3 py-1.5 transition-all ${isActive
                                        ? "text-primary"
                                        : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    <Icon
                                        className={`h-5 w-5 transition-transform ${isActive ? "scale-110" : ""
                                            }`}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />

                                    <span
                                        className={`text-[11px] ${isActive ? "font-semibold" : "font-medium"
                                            }`}
                                    >
                                        {item.label}
                                    </span>
                                </div>
                            )}
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
}