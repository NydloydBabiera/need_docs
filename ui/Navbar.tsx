"use client";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "./Button";

type NavbarProps = {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0; SameSite=Lax";

    useAuthStore.getState().clearUser;

    router.push("/login");
  };
  return (
    <nav className="bg-text-primary shadow-md ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* LEFT - Logo */}
          <div className="flex items-center space-x-2">
            <img src="document.svg" className="h-7" alt="IBS logo" />
            <span className="text-text-secondary font-semibold text-xl">
              Need docs?
            </span>
          </div>

          {/* RIGHT - User Dropdown */}
          <div className="hidden md:flex items-center relative">
            {user ? (
              <button
                onClick={() => setUserOpen(!userOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100"
              >
                <img src="user.png" className="h-7" alt="IBS logo" />
                <span className="text-text-secondary font-semibold">
                  {/* {user?.name} */}
                </span>
              </button>
            ) : (
              <Button className="btn-primary">Sign in</Button>
            )}

            {userOpen && (
              <div className="absolute right-0 top-12 w-40 bg-white  rounded-md shadow-lg">
                {/* <Link
                  href="/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </Link> */}
                <button
                  className="text-text-secondary w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 border-t">
          {/* <Link href="/" className="block py-2">
            Home
          </Link>
          <Link href="/events" className="block py-2">
            Events
          </Link>
          <Link href="/about" className="block py-2">
            About
          </Link> */}

          <div className="border-t pt-2">
            <Link href="/profile" className="block py-2">
              Profile
            </Link>
            <button className="block py-2 text-left w-full">Logout</button>
          </div>
        </div>
      )}
    </nav>
  );
}
