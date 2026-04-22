import CommonTitle from "../common/CommonTitle";
import CommonText from "../common/CommonText";

const Reviews = ({ testimonialTitle, testimonials = [] }) => {
  const title = testimonialTitle?.title || "What Our Users Say";
  const subtitle =
    testimonialTitle?.description ||
    "Trusted by directors, referees, and administrators worldwide";

  // Use the real field names from your JSON data
  const displayedTestimonials = testimonials.length > 0 ? testimonials : [];

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14 lg:mb-16">
        <CommonTitle text={title} />
        <CommonText
          text={subtitle}
          className="text-neutral-600 mt-3 md:mt-4 text-base md:text-lg"
        />
      </div>

      {/* Testimonials Grid */}
      {displayedTestimonials.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {displayedTestimonials.map((review) => (
            <div
              key={review.id}
              className={`
                bg-white rounded-xl shadow-sm border border-neutral-200 
                p-5 sm:p-6 lg:p-7 
                flex flex-col 
                transition-all duration-300 
                hover:shadow-md hover:border-primary/30 
                hover:-translate-y-1
              `}
            >
              {/* Review Text */}
              <div className="grow">
                <p className="text-neutral-700 leading-relaxed text-base sm:text-[15px] lg:text-base">
                  {review.review_text ||
                    review.feedback ||
                    review.description ||
                    review.content ||
                    "No review text provided"}
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 sm:gap-4 mt-6 pt-4 border-t border-neutral-100">
                {/* Avatar with fallback */}
                <div className="shrink-0">
                  {review.author_avatar ||
                  review.avatar ||
                  review.image ? (
                    <img
                      src={
                        review.author_avatar ||
                        review.avatar ||
                        review.image
                      }
                      alt={review.author_name || "User"}
                      className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full object-cover border-2 border-white shadow-sm"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/64?text=User";
                        e.target.onerror = null;
                      }}
                    />
                  ) : (
                    <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-semibold text-lg sm:text-xl shadow-sm">
                      {(review.author_name || "?")[0]?.toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Name & Designation */}
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                    {review.author_name || "Anonymous User"}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {review.designation ||
                      review.role ||
                      review.position ||
                      "User"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 md:py-20 text-neutral-500 bg-neutral-50/50 rounded-xl border border-dashed border-neutral-300">
          <p className="text-lg md:text-xl font-medium">
            No testimonials available yet
          </p>
          <p className="mt-2 text-sm md:text-base">
            Be the first to share your experience!
          </p>
        </div>
      )}
    </section>
  );
};

export default Reviews;