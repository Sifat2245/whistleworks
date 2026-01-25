import Logo from "@/components/common/Logo";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="lg:py-12 py-8 border-t border-gray-200">
      <div className="container w-full grid grid-cols-1 md:grid-cols-3 gap-4 justify-between">
        {/* Logo + Brand */}
        <Link to={'/'} className="md:w-2/3">
          <div className="flex items-center space-x-3 mb-4">
            <Logo className={"h-14 w-20"} />
            <h1 className="text-xl text-primary font-semibold">
              WHISTLE WORKERS
            </h1>
          </div>
        </Link>

        {/* Products */}
        <div className="w-full">
          <h2 className="text-lg font-semibold mb-3">Products</h2>
          <ul className="space-y-2 text-neutral-500">
            <li>
              <a href="#" className="hover:text-black transition-colors">
                For Referees
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black transition-colors">
                For Directors
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black transition-colors">
                For Evaluators / Clinicians
              </a>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div className="w-full">
          <h2 className="text-lg font-semibold mb-3">Company</h2>
          <ul className="space-y-2 text-neutral-500">
            <li>
              <a href="#" className="hover:text-black transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black transition-colors">
                Contact
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black transition-colors">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
export default Footer;