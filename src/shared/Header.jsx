// Header.jsx
import { useState } from "react";
import { Link, NavLink } from "react-router-dom"; // ← changed to NavLink
import { useAuth } from "@/hooks/useAuth";
import { Popover } from "antd";
import { FaBars, FaTimes } from "react-icons/fa";
import Logo from "@/components/common/Logo";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import NotificationBell from "./NotificationBell";
import UserPopover from "./UserPopover";
import userImage from "@/assets/dashboard/userImage.png";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { userData } = useAuth();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "All Camps", path: "/all-camps" },
    { name: "About Us", path: "/about-us" },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 container">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            {/* Logo + Title */}
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3">
              <Logo className="w-16 h-12" />
              <h1 className="text-base hidden md:block sm:text-2xl font-bold text-primary tracking-tight">
                WHISTLE WORKS
              </h1>
            </Link>

            {/* Desktop Navigation - visible from lg (≈1024px) */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `font-medium transition-colors ${
                      isActive
                        ? "text-primary font-semibold"
                        : "text-gray-700 hover:text-primary"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>

            {/* Right side - Auth / User area */}
            <div className="flex items-center gap-4 sm:gap-6">
              {userData ? (
                <>
                  <div className="hidden sm:block">
                    <NotificationBell />
                  </div>

                  <Popover
                    placement="bottomRight"
                    trigger="click"
                    content={<UserPopover />}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div className="size-9 sm:size-10 rounded-full ring-2 ring-gray-200 overflow-hidden flex-shrink-0">
                        <img
                          src={userData?.avatar || userImage}
                          alt={userData?.first_name || "User"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="hidden md:block">
                        <p className="font-medium text-gray-900 text-sm leading-tight">
                          {userData?.first_name || "User"}
                        </p>
                      </div>
                    </div>
                  </Popover>

                  {/* Mobile-only notification bell */}
                  <div className="sm:hidden">
                    <NotificationBell />
                  </div>
                </>
              ) : (
                <div className="hidden lg:flex items-center gap-4">
                  <Link to="/auth/signin">
                    <CommonSubmitBtn variant="secondary" size="sm">
                      Login
                    </CommonSubmitBtn>
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={toggleSidebar}
                className="lg:hidden text-gray-700 text-2xl focus:outline-none"
                aria-label="Toggle menu"
              >
                {isSidebarOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          isSidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={closeSidebar}
          aria-hidden="true"
        />

        {/* Sidebar content */}
        <div
          className={`absolute right-0 top-0 h-full w-4/5 max-w-xs bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-5 sm:p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Logo className="size-9" />
                  <span className="text-lg text-primary font-semibold">WHISTLE WORKS</span>
                </div>
                <button
                  onClick={closeSidebar}
                  className="text-2xl text-gray-600 hover:text-gray-900 focus:outline-none"
                  aria-label="Close menu"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-5 py-8 overflow-y-auto">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `block py-3.5 px-4 text-base font-medium rounded-lg transition ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-gray-800 hover:bg-gray-100 hover:text-primary"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>

            {/* Footer area - auth or user info */}
            <div className="p-5 sm:p-6 border-t mt-auto">
              {userData ? (
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full overflow-hidden ring-2 ring-gray-200 flex-shrink-0">
                    <img
                      src={userData?.avatar || userImage}
                      alt={userData?.first_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {userData?.first_name} {userData?.last_name?.[0] || ""}
                    </p>
                    <p className="text-sm text-gray-500 truncate max-w-[180px]">
                      {userData?.email}
                    </p>
                  </div>
                </div>
              ) : (
                <Link to="/auth/signin" onClick={closeSidebar} className="block">
                  <CommonSubmitBtn variant="secondary" className="w-full py-3">
                    Login
                  </CommonSubmitBtn>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content jump under fixed header */}
      <div className="h-16 sm:h-20" />
    </>
  );
};

export default Header;