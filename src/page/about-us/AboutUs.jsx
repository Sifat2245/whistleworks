import { useAboutCms } from "@/hooks/api/useCms";
import { Link } from "react-router-dom";
import {
  LuSparkles,
  LuTarget,
  LuAward,
  LuUsers,
  LuBriefcase,
  LuShieldCheck,
  LuArrowRight,
  LuQuote,
  LuMail,
} from "react-icons/lu";

const AboutUs = () => {
  const { data: aboutData, isLoading } = useAboutCms();

  if (isLoading || !aboutData) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center space-y-4 animate-pulse">
          <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 text-primary flex items-center justify-center mx-auto text-xl">
            <LuSparkles className="animate-spin" />
          </div>
          <p className="text-slate-400 text-sm font-medium">Loading About WhistleWorks...</p>
        </div>
      </div>
    );
  }

  const {
    hero = [],
    mission = [],
    key_to_excellence,
    bottom_description,
    features_item = [],
    owner_info,
    team_header,
    team_member = [],
    get_started,
  } = aboutData;

  const heroItem = hero[0] || {};
  const missionItem = mission[0] || {};

  const bottomParagraphs = bottom_description?.description
    ? bottom_description.description.split(/\r?\n\r?\n/).filter(Boolean)
    : [];

  const hasTeamMembers = team_member.length > 0;

  return (
    <div className="w-full bg-slate-50 min-h-screen text-slate-900 overflow-hidden font-sans">
      {/* ── 1. Modern Hero Section ────────────────────────────────── */}
      <section className="relative bg-slate-950 text-white pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-16 lg:pb-18 overflow-hidden">
        {/* Soft Radial Light Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[38rem] h-[18rem] bg-primary/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-sky-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-primary text-xs font-bold uppercase tracking-wider mb-3.5">
            <LuSparkles className="text-amber-400 text-xs" />
            <span>Official Training & Camp Tech</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15] mb-3">
            {heroItem.title || "Elevating Sports Officiating"}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            {heroItem.description ||
              "Developing better officials through elite training, honest feedback, and innovative technology."}
          </p>
        </div>
      </section>

      {/* ── 2. Full-Width Metrics Bar ──────────────────────────────── */}
      {owner_info?.stats && owner_info.stats.length > 0 && (
        <section className="bg-white border-b border-slate-200/80 py-5 sm:py-6 shadow-xs">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x-0 md:divide-x divide-slate-100">
              {owner_info.stats.map((stat, idx) => (
                <div key={idx} className="px-3">
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
              <div className="px-3 hidden md:block">
                <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-primary tracking-tight">
                  100%
                </p>
                <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">
                  Official Development
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 3. Editorial Founder Story Section ────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left Column: Organic Portrait Card */}
            <div className="lg:col-span-5 w-full">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Subtle Ambient Frame Glow */}
                <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-tr from-primary/30 via-sky-400/20 to-transparent blur-2xl opacity-70" />

                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-900 border border-slate-200/50 aspect-[4/5] w-full">
                  <img
                    src={owner_info?.image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800"}
                    alt={owner_info?.name || "Drew Bontrager"}
                    className="w-full h-full object-cover object-top"
                  />

                  {/* Overlaid Gradient Tint */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

                  {/* Overlaid Profile Card */}
                  <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-white/95 backdrop-blur-md border border-white/50 shadow-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary">
                        {owner_info?.designation || "CEO / Founder"}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                        Verified NCAA
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-slate-900">
                      {owner_info?.name || "Drew Bontrager"}
                    </h3>

                    <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-slate-600">
                      <LuMail className="text-primary shrink-0 text-sm" />
                      <span>drewbontrager@gmail.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Narrative */}
            <div className="lg:col-span-7 w-full space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-primary">
                <LuBriefcase />
                <span>Our Leadership & Story</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Built by Referees, for Referees
              </h2>

              <p className="text-lg sm:text-xl font-medium text-slate-700 leading-relaxed border-l-4 border-primary pl-5 py-1">
                WhistleWorks was created to modernize how basketball referee camps, officiating clinics, and development events are managed.
              </p>

              <div className="space-y-4 text-slate-600 leading-relaxed text-base sm:text-lg pt-2">
                {bottomParagraphs.length > 0 ? (
                  bottomParagraphs.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))
                ) : (
                  <>
                    <p>
                      WhistleWorks was founded by Drew Bontrager, a retired NCAA Division I men&apos;s basketball referee who officiated in the Missouri Valley, Ohio Valley, and Southland Conferences. Drew remains an active leader in the basketball officiating community with years of experience coordinating officials and managing large-scale referee development events.
                    </p>
                    <p>
                      After experiencing firsthand the challenges that camp directors and officials face—from scheduling and communication to evaluations and logistics—he created WhistleWorks to provide a better, more organized solution built specifically for the officiating world.
                    </p>
                  </>
                )}
              </div>

              {/* Contact / Connect Tag */}
              <div className="pt-4 flex items-center gap-4">
                <div className="px-5 py-3 rounded-2xl bg-slate-100 text-slate-800 text-xs sm:text-sm font-bold flex items-center gap-2">
                  <LuShieldCheck className="text-primary text-base" />
                  <span>25+ Years Officiating Leadership</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. Mission & Core Values Grid ────────────────────────── */}
      <section className="py-16 bg-white border-t border-b border-slate-200/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">

            {/* Mission Statement Box */}
            <div className="lg:col-span-6 bg-slate-950 text-white rounded-3xl p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden shadow-xl">
              <LuQuote className="absolute right-6 top-6 text-white/5 text-9xl pointer-events-none" />

              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/20 text-sky-300 text-xs font-bold uppercase tracking-wider mb-6 border border-primary/30">
                  <LuTarget className="text-primary" />
                  <span>{missionItem.title || "Our Mission"}</span>
                </div>

                <p className="text-xl sm:text-2xl font-medium leading-relaxed text-slate-100 relative z-10">
                  {`"${missionItem.description || "To develop better officials through elite training, honest feedback, and innovative technology, helping referees advance their careers at every level."}"`}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800 text-xs font-semibold text-slate-400">
                Official WhistleWorks Commitment
              </div>
            </div>

            {/* Key to Excellence Box */}
            {key_to_excellence && (
              <div className="lg:col-span-6 bg-gradient-to-br from-sky-50 to-slate-100 border border-sky-200/70 rounded-3xl p-8 sm:p-12 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl mb-6">
                    <LuAward />
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
                    {key_to_excellence.title}
                  </h3>

                  <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
                    {key_to_excellence.description}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-sky-200/50 text-xs font-bold uppercase tracking-wider text-primary">
                  Built for Officiating Excellence
                </div>
              </div>
            )}
          </div>

          {/* Features Grid */}
          {features_item.length > 0 && (
            <div>
              <div className="text-center max-w-2xl mx-auto mb-10">
                <h3 className="text-2xl font-black text-slate-900">Key Operating Pillars</h3>
                <p className="text-slate-500 text-sm mt-1">What sets our referee training platform apart</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {features_item.map((feature) => (
                  <div
                    key={feature.id}
                    className="p-6 bg-slate-50 rounded-3xl border border-slate-200/70 hover:bg-white hover:border-primary/40 hover:shadow-lg transition-all group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white text-primary flex items-center justify-center shadow-xs border border-slate-200 mb-4 group-hover:scale-110 transition-transform">
                      {feature.image ? (
                        <img
                          src={feature.image}
                          alt={feature.title}
                          className="w-6 h-6 object-contain"
                        />
                      ) : (
                        <LuShieldCheck className="text-xl" />
                      )}
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-lg mb-1">{feature.title}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 5. Team Roster Section ──────────────────────────────── */}
      {hasTeamMembers && (
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
                <LuUsers className="text-xs" />
                <span>Leadership & Staff</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
                {team_header?.title || "Meet Our Team"}
              </h2>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                {team_header?.description ||
                  "Our dedicated team brings together expertise in sports officiating, technology, and clinic evaluation."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team_member.map((member) => (
                <div
                  key={member.id}
                  className="group bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl overflow-hidden transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                    <img
                      src={member.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600"}
                      alt={member.title || "Team Member"}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                      {member.title}
                    </h3>
                    {member.designation && (
                      <p className="text-xs font-semibold text-primary mt-1">
                        {member.designation}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 6. High Impact Call to Action ───────────────────────── */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-slate-950 text-white rounded-[2.5rem] p-10 sm:p-16 lg:p-20 overflow-hidden border border-slate-800 shadow-2xl text-center">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
                {get_started?.title || "Ready to Elevate Your Officiating Career?"}
              </h2>

              <p className="text-slate-300 text-base sm:text-xl mb-10 leading-relaxed font-light">
                {get_started?.description ||
                  "Join WhistleWorks today and start your journey towards becoming an elite official with our proven training methods and cutting-edge technology."}
              </p>

              <Link
                to="/auth/signup"
                className="inline-flex items-center gap-3 px-9 py-4.5 rounded-2xl bg-primary hover:bg-sky-400 text-white font-extrabold text-base sm:text-lg transition-all shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:scale-105 group cursor-pointer"
              >
                <span>Get Started Now</span>
                <LuArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;