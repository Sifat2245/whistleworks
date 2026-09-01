import Logo from "@/components/common/Logo";
import { Link } from "react-router-dom";
import { LuMail, LuArrowRight, LuShieldCheck, LuLock, LuLayoutDashboard } from "react-icons/lu";
import { useAuth } from "@/hooks/useAuth";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { userData } = useAuth();
  const userRole = userData?.role;

  const dashboardPath =
    {
      director: "/director-dashboard",
      evaluator: "/evaluator-dashboard",
      referee: "/referee-dashboard",
    }[userRole] || "/";

  return (
    <footer className="bg-white text-slate-600 border-t border-slate-200 relative overflow-hidden font-sans">
      {/* Background Decorative Glow Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Column 1: Brand Info */}
          <div className="space-y-4 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <Logo className="h-12 w-16 group-hover:scale-105 transition-transform" />
              <span className="text-xl font-extrabold text-slate-900 tracking-tight group-hover:text-primary transition-colors">
                WHISTLE WORKS
              </span>
            </Link>

            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              The modern sports officiating and camp management platform. Empowering camp directors, evaluators, and referees with real-time assignment tools.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-slate-500 font-medium">
              <LuShieldCheck className="text-primary text-base shrink-0" />
              <span>Enterprise Officiating Infrastructure</span>
            </div>
          </div>

          {/* Column 2: Quick Links / Navigation */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Quick Navigation
            </h3>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link to="/" className="text-slate-600 hover:text-primary transition-colors flex items-center gap-1.5">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/all-camps" className="text-slate-600 hover:text-primary transition-colors flex items-center gap-1.5">
                  All Camps
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="text-slate-600 hover:text-primary transition-colors flex items-center gap-1.5">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-slate-600 hover:text-primary transition-colors flex items-center gap-1.5">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-slate-600 hover:text-primary transition-colors flex items-center gap-1.5">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="text-slate-600 hover:text-primary transition-colors flex items-center gap-1.5">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Contact Us
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed mb-3">
              Have questions or need support with camp management? Reach out to our team directly.
            </p>

            <a
              href="mailto:drewbontrager@gmail.com"
              className="group inline-flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-primary/50 hover:bg-slate-100 transition-all duration-300 text-slate-800 text-xs sm:text-sm font-medium w-full"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <LuMail className="text-base" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none mb-0.5">
                  Email Support
                </span>
                <span className="truncate block font-semibold text-slate-800 group-hover:text-primary transition-colors">
                  drewbontrager@gmail.com
                </span>
              </div>
            </a>
          </div>

          {/* Column 4: Platform Access / Portal */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Platform Portal
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed mb-4">
              Access your camp schedules, evaluation reports, and court assignment dashboards.
            </p>

            <div className="space-y-3">
              {userData ? (
                <Link
                  to={dashboardPath}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-white text-white hover:text-slate-900 border border-primary hover:border-slate-300 font-bold text-sm transition-all shadow-md shadow-primary/10 group cursor-pointer text-center"
                >
                  <LuLayoutDashboard className="text-sm" />
                  <span>Go to Dashboard</span>
                  <LuArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/auth/signin"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-white text-white hover:text-slate-900 border border-primary hover:border-slate-300 font-bold text-sm transition-all shadow-md shadow-primary/10 group cursor-pointer"
                  >
                    <LuLock className="text-sm" />
                    <span>Login to Account</span>
                    <LuArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    to="/auth/signup"
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-semibold text-xs transition-colors text-center cursor-pointer block"
                  >
                    <span>Create New Account</span>
                  </Link>
                </>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Terms */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} Whistle Works. All rights reserved.</p>
          <div className="flex items-center gap-6 font-medium">
            <Link to="/privacy-policy" className="hover:text-slate-900 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-conditions" className="hover:text-slate-900 transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/faq" className="hover:text-slate-900 transition-colors">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;