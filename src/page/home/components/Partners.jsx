import { Link } from "react-router-dom";
import CommonTitle from "../../../components/common/CommonTitle";
import Marquee from "react-fast-marquee";
import { FaHandshake, FaShieldHalved } from "react-icons/fa6";

const Partners = ({ partnerLogos = [], partners = [] }) => {
  return (
    <section className="bg-slate-900 text-white py-14 relative overflow-hidden border-t border-b border-slate-800">
      {/* Background Accent Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Side Fade Gradient */}
      <div className="absolute top-0 left-0 h-full w-24 sm:w-40 bg-linear-to-r from-slate-900 to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 right-0 h-full w-24 sm:w-40 bg-linear-to-l from-slate-900 to-transparent pointer-events-none z-10" />

      <div className="relative z-10 text-center container mx-auto px-4 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
          <span>Strategic Association Partners</span>
        </div>

        <CommonTitle
          text={partners?.title || "Trusted by Premier Athletic Conferences & Leagues"}
          className="text-white text-xl sm:text-2xl lg:text-3xl font-extrabold"
        />
      </div>

      {partnerLogos.length > 0 ? (
        <Marquee speed={50} pauseOnHover={true} gradient={false} className="py-4">
          {[...partnerLogos, ...partnerLogos].map((logo, index) => (
            <div
              key={`${logo.id || index}-${index}`}
              className="flex items-center justify-center mx-10 sm:mx-16 md:mx-20 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-xs hover:border-primary/40 transition-colors"
            >
              <Link to={logo.link || "#"}>
                <img
                  src={logo.image}
                  alt="Partner logo"
                  className="h-12 sm:h-16 md:h-20 w-auto object-contain brightness-95 hover:brightness-110 transition-all duration-300 filter"
                  loading="lazy"
                />
              </Link>
            </div>
          ))}
        </Marquee>
      ) : (
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-12 py-4 px-4 max-w-4xl mx-auto opacity-75">
          <div className="flex items-center gap-2 text-slate-400 font-bold text-sm sm:text-base border border-slate-700/80 px-4 py-2 rounded-xl bg-slate-800/40">
            <FaShieldHalved className="text-primary" />
            <span>NCAA Officiating Standards</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 font-bold text-sm sm:text-base border border-slate-700/80 px-4 py-2 rounded-xl bg-slate-800/40">
            <FaShieldHalved className="text-emerald-400" />
            <span>FIBA Rules Ready</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 font-bold text-sm sm:text-base border border-slate-700/80 px-4 py-2 rounded-xl bg-slate-800/40">
            <FaShieldHalved className="text-amber-400" />
            <span>High School State Federations</span>
          </div>
        </div>
      )}

      {/* Partner names note */}
      {partners.length > 0 && (
        <div className="text-center mt-6 text-xs text-slate-400 font-medium">
          In active partnership with {partners.map((p) => p.name).join(", ")}
        </div>
      )}
    </section>
  );
};

export default Partners;
