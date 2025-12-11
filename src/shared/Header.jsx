import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import Logo from "@/components/common/Logo";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Note: navLinks dummy data
  const links = [
    { name: "Home", href: "#" },
    { name: "Features", href: "#" },
    { name: "Testimonials", href: "#" },
    { name: "About Us", href: "about-us" },
    { name: "Evaluator", href: "evolator-dashboard", isEvaluator: true },
  ];

  // Note: main ui component
  return (
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container py-5 flex justify-between items-center">
        {/* Logo */}
        <Link to={"/"} className="flex items-center text-primary shrink-0">
          <Logo className={"h-9 w-14 shrink-0"} />
          <h1 className="xl:text-2xl text-xl font-semibold">WHISTLE WORKS</h1>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex xl:space-x-8 space-x-6">
          {links?.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-gray-700 hover:text-primary transition font-medium ${link?.isEvaluator && "text-blue-500!"}`}
            >
              {link?.name}
            </a>
          ))}
        </nav>

        {/* Right Buttons */}
        <div className="hidden lg:flex space-x-3">
          <Link to={"/auth/signin"}>
            <CommonSubmitBtn variant="secondary" className={""}>
              Login
            </CommonSubmitBtn>
          </Link>

          <Link to={'/auth/signup'}>
            <CommonSubmitBtn variant="primary" className={""}>
              Get Started
            </CommonSubmitBtn>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="lg:hidden flex items-center">
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