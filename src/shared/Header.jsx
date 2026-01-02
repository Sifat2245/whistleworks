// Header.jsx
import { useState } from "react";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import Logo from "@/components/common/Logo";
import { useAuth } from "@/hooks/useAuth";
import { Popover } from "antd";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import UserPopover from "./UserPopover";
import userImage from "@/assets/dashboard/userImage.png";
import NotificationBell from "./NotificationBell";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { userData } = useAuth();

  const links = [
    { name: "Home", href: "/" },
    { name: "All Camps", href: "/all-camps" },
    // { name: "Features", href: "#" },
    // { name: "Testimonials", href: "#" },
    { name: "About Us", href: "/about-us" },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
        <div className="container py-5 flex justify-between items-center">
          {/* Logo */}
          <Link to={"/"} className="flex items-center gap-3 text-primary">
            <Logo className="size-8 sm:size-12 shrink-0" />
            <h1 className="text-lg sm:text-2xl font-bold">WHISTLE WORKS</h1>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center xl:space-x-8 space-x-6">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-primary transition font-medium"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Side - User or Auth Buttons */}
          {userData ? (
            <div className="flex items-center gap-4">
              <NotificationBell badgeCount={2} />
              <Popover
                placement="bottomRight"
                trigger="click"
                content={<UserPopover />}
              >
                <div className="flex items-center gap-3 cursor-pointer">
                  <div className="size-10 ring-2 ring-[#E5E4E6] rounded-full overflow-hidden">
                    <img
                      src={userData?.avatar || userImage}
                      alt={userData?.first_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-medium text-gray-800 hidden sm:block">
                    {userData?.first_name || "User"}
                  </span>
                </div>
              </Popover>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-3">
              <Link to="/auth/signin">
                <CommonSubmitBtn variant="secondary">Login</CommonSubmitBtn>
              </Link>
            </div>
          )}

          {/* Mobile Hamburger */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-2xl text-gray-700 z-50"
          >
            <FaBars />
          </button>
        </div>
      </header>

      {/* Mobile Sidebar - Slides from Right */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          isSidebarOpen
            ? "pointer-events-auto"
            : "pointer-events-none"
        }`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            isSidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsSidebarOpen(false)}
        />

        {/* Sidebar Panel */}
        <div
          className={`absolute right-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Logo className="size-10" />
                  <h2 className="text-xl font-bold">WHISTLE WORKS</h2>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-2xl text-gray-600 hover:text-gray-900"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-6 py-8">
              <div className="space-y-4">
                {links.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className="block py-3 px-4 text-lg font-medium text-gray-800 hover:bg-gray-100 hover:text-primary rounded-lg transition"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </nav>

            {/* Auth Buttons (if not logged in) */}
            {!userData && (
              <div className="p-6 border-t border-gray-200 space-y-3">
                <Link
                  to="/auth/signin"
                  className="block w-full"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <CommonSubmitBtn variant="secondary" className="w-full">
                    Login
                  </CommonSubmitBtn>
                </Link>
              </div>
            )}

            {/* User Info (if logged in) */}
            {userData && (
              <div className="p-6 border-t border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="size-14 ring-4 ring-gray-200 rounded-full overflow-hidden">
                    <img
                      src={userData?.avatar || userImage}
                      alt={userData?.first_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {userData?.first_name} {userData?.last_name}
                    </p>
                    <p className="text-sm text-gray-600">{userData?.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;