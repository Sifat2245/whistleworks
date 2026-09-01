import Marquee from "react-fast-marquee";
import { FaStar, FaCircleCheck } from "react-icons/fa6";
import CommonTitle from "../../../components/common/CommonTitle";

const ReviewCard = ({ review }) => {
  const authorName = review.author_name || review.name || review.title || "Verified Official";
  const authorRole = review.designation || review.role || review.position || "Official Member";
  const avatarUrl = review.author_avatar || review.avatar || review.image;
  const reviewContent =
    review.review_text || review.feedback || review.description || review.content || "";
  const ratingCount = parseInt(review.rating || review.star || 5);
  const postedDate = review.date || review.created_at || "Whistle Works Member";

  return (
    <div className="w-[360px] sm:w-[420px] shrink-0 mx-3 my-2.5 flex flex-col justify-between bg-slate-800/90 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-slate-700/80 shadow-xl hover:border-[#00AEEF]/60 hover:shadow-2xl hover:shadow-[#00AEEF]/10 transition-all duration-300">
      <div>
        {/* Author Header Row */}
        <div className="flex items-center gap-3.5 mb-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={authorName}
              className="w-12 h-12 rounded-full object-cover border-2 border-primary/40 shadow-sm shrink-0"
              onError={(e) => {
                e.target.style.display = "none";
                if (e.target.nextSibling) e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className="w-12 h-12 rounded-full bg-slate-700 text-primary font-bold text-base border border-slate-600 flex items-center justify-center shrink-0"
            style={{ display: avatarUrl ? "none" : "flex" }}
          >
            {authorName[0]?.toUpperCase() || "O"}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-white text-sm sm:text-base truncate">
                {authorName}
              </h4>
              <FaCircleCheck className="text-[#00AEEF] text-xs shrink-0" title="Verified Review" />
            </div>
            <p className="text-xs text-slate-400 truncate">
              {authorRole}
            </p>
          </div>
        </div>

        {/* Full Review Content (No line clamp!) */}
        <p className="text-slate-200 text-xs sm:text-sm leading-relaxed mb-4 font-normal whitespace-pre-line">
          {`"${reviewContent}"`}
        </p>
      </div>

      {/* Footer Info Row */}
      <div className="pt-3.5 border-t border-slate-700/70 flex items-center justify-between text-xs text-slate-400 font-medium">
        <div className="flex items-center gap-1">
          <span className="text-amber-400 flex items-center gap-0.5">
            {[...Array(ratingCount)].map((_, i) => (
              <FaStar key={i} className="text-xs" />
            ))}
          </span>
        </div>
        <span className="text-[11px] text-slate-400">{postedDate}</span>
      </div>
    </div>
  );
};

const Reviews = ({ testimonialTitle, testimonials = [] }) => {
  const title = testimonialTitle?.title || "Trusted by Officials & Directors Worldwide";
  const subtitle =
    testimonialTitle?.description ||
    "See how Whistle Works simplifies camp administration, crew scheduling, and referee evaluations.";

  const realTestimonials = Array.isArray(testimonials) ? testimonials : [];

  if (realTestimonials.length === 0) {
    return null; // Do not render dummy data if no real testimonials are provided
  }

  // Duplicate real testimonials for continuous scrolling marquee
  const row1Items =
    realTestimonials.length < 6
      ? [...realTestimonials, ...realTestimonials, ...realTestimonials, ...realTestimonials]
      : realTestimonials;

  const row2Items = [...row1Items].reverse();

  return (
    <section className="relative py-16 md:py-24 bg-slate-900 text-white overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <FaStar className="text-amber-400 text-xs" />
            <span>Verified User Reviews</span>
          </div>

          <CommonTitle
            text={title}
            className="text-white text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight"
          />
          <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Dual Row Continuous Marquee Slider */}
      <div className="relative z-10 space-y-4">
        {/* Fade gradients on left & right edges */}
        <div className="absolute top-0 left-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-slate-900 to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-slate-900 to-transparent z-20 pointer-events-none" />

        {/* Row 1: Left scrolling */}
        <Marquee speed={30} pauseOnHover={true} direction="left" gradient={false}>
          {row1Items.map((review, idx) => (
            <ReviewCard key={`r1-${review.id || idx}-${idx}`} review={review} />
          ))}
        </Marquee>

        {/* Row 2: Right scrolling */}
        <Marquee speed={25} pauseOnHover={true} direction="right" gradient={false}>
          {row2Items.map((review, idx) => (
            <ReviewCard key={`r2-${review.id || idx}-${idx}`} review={review} />
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default Reviews;