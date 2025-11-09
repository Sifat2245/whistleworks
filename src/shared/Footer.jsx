import Logo from "@/components/common/Logo";

const Footer = () => {
  return (
    <footer className="py-12">
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center">
        {/* Logo + Brand */}
        <div className="w-2/3">
          <div className="flex items-center space-x-3 mb-4">
            <Logo className={"h-14 w-20"} />
            <h1 className="text-xl text-primary font-semibold">
              WHISTLE WORKERS
            </h1>
          </div>
          <p className="text-sm text-gray-400">
            Professional referee camp management for modern sports organizations
          </p>
        </div>

        {/* Products */}
        <div>
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
        <div>
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

      {/* Footer Bottom
      <div className="border-t border-neutral-700 mt-10 pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Whistle Workers. All rights reserved.
      </div> */}
    </footer>
  );
};

export default Footer;
