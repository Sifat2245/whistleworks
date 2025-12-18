import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import Logo from "@/components/common/Logo";
import { useAuth } from "@/hooks/useAuth";
import { Popover } from "antd";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import UserPopover from "./UserPopover";
import { IoNotificationsOutline } from "react-icons/io5";
import userImage from "@/assets/dashboard/userImage.png";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userData } = useAuth();

  // Note: navLinks dummy data
  const links = [
    { name: "Home", href: "#" },
    { name: "Features", href: "#" },
    { name: "Testimonials", href: "#" },
    { name: "About Us", href: "about-us" },
  ];

  // Note: main ui component
  return (
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container py-5 flex justify-between items-center">
        {/* Logo */}
        <Link to={"/"} className="flex items-center text-primary">
          <Logo className={"size-8 sm:size-12 shrink-0"} />
          <h1
            className={`xl:text-2xl font-semibold ${
              userData ? "text-base sm:text-xl" : ""
            }`}
          >
            WHISTLE WORKS
          </h1>
        </Link>

        {/* Desktop Nav */}

        <nav className="hidden lg:flex xl:space-x-8 space-x-6">
          {links?.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-gray-700 hover:text-primary transition font-medium}`}
            >
              {link?.name}
            </a>
          ))}
        </nav>

        {/* Right Buttons and check if user button is logged in */}
        {userData ? (
          <div className="flex items-center md:gap-4 gap-1.5 cursor-pointer">
            <Popover
              className="header-popover"
              placement="bottomRight"
              trigger={"click"}
              content={<UserPopover />}
            >
              <div className="flex items-center md:gap-4 gap-1.5">
                <div className="md:size-10 size-7 shrink-0 ring-2  ring-[#E5E4E6] rounded-full cursor-pointer">
                  <img
                    src={userData?.avatar || userImage}
                    alt=""
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <p className="text-black font-medium text-base">
                  {userData?.first_name || "Xadu"}
                </p>
              </div>
            </Popover>

            <button className="cursor-pointer relative">
              <IoNotificationsOutline className="text-xl" />

              <span className="absolute flex items-center justify-center -top-3 -right-2.5 size-5 bg-primary text-white rounded-lg border-2 border-white text-xs">
                2
              </span>
            </button>
          </div>
        ) : (
          <div className="hidden lg:flex space-x-3">
            <Link to={"/auth/signin"}>
              <CommonSubmitBtn variant="secondary" className={""}>
                Login
              </CommonSubmitBtn>
            </Link>

            {/* <Link to={"/auth/signup"}>
              <CommonSubmitBtn variant="primary" className={""}>
                Get Started
              </CommonSubmitBtn>
            </Link> */}
          </div>
        )}

        {/* Mobile Hamburger */}
        <div className={`lg:hidden flex items-center ${userData && "hidden"}`}>
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <FaTimes className="text-2xl text-gray-700" />
            ) : (
              <FaBars className="text-2xl text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white shadow-md border-t border-gray-100">
          <nav className="flex flex-col space-y-4 px-6 py-4">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-primary transition font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100">
              <CommonSubmitBtn variant="secondary" className={""}>
                Login
              </CommonSubmitBtn>

              <CommonSubmitBtn variant="primary" className={""}>
                Get Started
              </CommonSubmitBtn>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
export default Header;
